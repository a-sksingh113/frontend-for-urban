/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  autocompletePlacesAction,
  getPlaceDetailsAction,
  reverseGeocodeAction,
} from "@/actions/places";
import { LRUCache } from "@/lib/LRUCache";
import { makeKey } from "@/lib/makeKey";

import type {
  OnPlaceSelected,
  PlaceDetails,
  SuggestionItem,
} from "../components/molecules/pages/start/location-picker/types";
import { newToken } from "../components/molecules/pages/start/location-picker/utils";

// ---- Query classification (regex + heuristics) ------------------------------
const reUSZip = /^\d{5}(?:-\d{4})?$/i;
const reUKPostcode = /^(GIR ?0AA|[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})$/i; // tolerant of space
const reCAPostal = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
const reAUPostcode = /^\d{4}$/;
const reStreetish = /^\d+\s+[A-Za-z].+/; // "123 Main", "50 Market St"
const reCityCommaRegion = /^[A-Za-z][A-Za-z'’.\-\s]+,\s*[A-Za-z]{2,}$/; // "Paris, FR" / "Austin, TX"

// keyboard smash / low-signal patterns
const reKeyboardRows =
  /^(?:[asdfghjkl;'\[\]\\]+|[qwertyuiop]+|[zxcvbnm,./]+)$/i;
const reLongConsonantRun = /[bcdfghjklmnpqrstvwxyz]{5,}/i;

function looksLikePostalOrAddress(q: string) {
  const s = q.trim();
  return (
    reUSZip.test(s) ||
    reUKPostcode.test(s) ||
    reCAPostal.test(s) ||
    reAUPostcode.test(s) ||
    reStreetish.test(s) ||
    reCityCommaRegion.test(s)
  );
}

function isLikelyGibberish(q: string) {
  const s = q.trim();
  if (s.length < 3) return false; // let the short-input branch handle this
  // if it looks like a postal/address pattern, don’t block
  if (looksLikePostalOrAddress(s)) return false;

  // heuristic: no spaces & very few vowels & no digits → likely junk
  const letters = s.replace(/[^A-Za-z]/g, "");
  const vowels = (letters.match(/[aeiou]/gi) || []).length;
  const vowelRatio = letters.length ? vowels / letters.length : 0;

  if (
    reKeyboardRows.test(s) ||
    reLongConsonantRun.test(s) ||
    (!/\s/.test(s) && !/\d/.test(s) && vowelRatio < 0.25)
  ) {
    return true;
  }
  return false;
}

// ── Recents ───────────────────────────────────────────────────────────────────
const RECENTS_KEY = "places:recent";
const RECENTS_LIMIT = 4;

type RecentItem = SuggestionItem;

function loadRecents(): RecentItem[] {
  try {
    const raw = sessionStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as RecentItem[]) : [];
  } catch {
    return [];
  }
}
function saveRecents(list: RecentItem[]) {
  try {
    sessionStorage.setItem(
      RECENTS_KEY,
      JSON.stringify(list.slice(0, RECENTS_LIMIT))
    );
  } catch {}
}
function addRecent(next: RecentItem) {
  const curr = loadRecents();
  const deduped = [
    next,
    ...curr.filter((r) =>
      next.placeId && r.placeId === next.placeId ? false : r.text !== next.text
    ),
  ];
  saveRecents(deduped);
}

// ── Caching / timing ──────────────────────────────────────────────────────────
const DEBOUNCE_MS = 300;
const CACHE_MAX = 200;
const CACHE_TTL_MS = 5 * 60 * 1000;

export function usePlacesAutocomplete(onPlaceSelected?: OnPlaceSelected) {
  // UI state
  const [q, setQ] = useState("");
  const [caret, setCaret] = useState<number | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<SuggestionItem | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<PlaceDetails | null>(
    null
  );

  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [geoBlocked, setGeoBlocked] = useState(false);
  const [approximateLocationMessage, setApproximateLocationMessage] =
    useState("");

  // Refs
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const tRef = useRef<number | null>(null);
  const suppressFetchRef = useRef(false);

  const tokenRef = useRef<string>(newToken());
  const lastIssuedRef = useRef<string>("");

  // cache + in-flight + abort
  const cacheRef = useRef(
    new LRUCache<string, SuggestionItem[]>(CACHE_MAX, CACHE_TTL_MS)
  );
  const inFlightRef = useRef<Map<string, Promise<SuggestionItem[]>>>(new Map());
  const ctrlRef = useRef<AbortController | null>(null);
  const ctrlKeyRef = useRef<string | null>(null);

  // details abort controller (separate from autocomplete)
  const detailsCtrlRef = useRef<AbortController | null>(null);

  // open recents on focus when empty
  const wantRecentsOpenRef = useRef(false);

  // ── Keep highlighted item in view ───────────────────────────────────────────
  useEffect(() => {
    if (!listRef.current || activeIndex < 0) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `#places-dropdown-option-${activeIndex}`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // ── Load recents on mount ───────────────────────────────────────────────────
  useEffect(() => {
    setRecents(loadRecents());
  }, []);

  // ── Main autocomplete effect (with cache, dedupe, abort, race-guard) ───────
  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }
    setApproximateLocationMessage("");
    // debounce reset
    if (tRef.current) {
      clearTimeout(tRef.current);
      tRef.current = null;
    }

    const query = q.trim();
    setError(null);

    // GIBBERISH GUARD: don't hit Places; clear stale selection
    if (isLikelyGibberish(query)) {
      // clear stale selection so submit disables in parent
      if (selected) {
        setSelected(null);
        setSelectedDetails(null);
      }
      // don't fetch; show top-of-field error (FieldError already wired)
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      setLoading(false);
      setError("Please enter a valid address or postcode.");
      return;
    }

    // Short queries → show recents; abort any in-flight fetch; rotate token on full clear
    if (!query || query.length < 3) {
      if (!query) tokenRef.current = newToken();
      if (ctrlRef.current) {
        ctrlRef.current.abort();
        ctrlRef.current = null;
        ctrlKeyRef.current = null;
      }

      const r = loadRecents();
      setResults(r);

      const inputIsFocused =
        typeof document !== "undefined" &&
        inputRef.current &&
        document.activeElement === inputRef.current;

      const shouldOpen = !!(
        (wantRecentsOpenRef.current || inputIsFocused) &&
        r.length > 0
      );
      setIsOpen(shouldOpen);
      wantRecentsOpenRef.current = false;
      setActiveIndex(r.length ? 0 : -1);

      if (selected && selected.text !== query) {
        setSelected(null);
        setSelectedDetails(null);
      }
      return;
    }

    const offset =
      typeof caret === "number"
        ? Math.max(0, Math.min(caret, query.length))
        : undefined;

    // Build a stable key (aligned with your makeKey logic)
    const key = makeKey(query);

    // Abort previous in-flight if it’s for a different key
    if (ctrlRef.current && ctrlKeyRef.current && ctrlKeyRef.current !== key) {
      ctrlRef.current.abort();
      ctrlRef.current = null;
      ctrlKeyRef.current = null;
    }

    tRef.current = window.setTimeout(async () => {
      // 1) CACHE HIT
      const cached = cacheRef.current.get(key);
      if (cached) {
        lastIssuedRef.current = `cache:${key}`;
        setResults(cached);
        setIsOpen(true);
        setActiveIndex(selected ? findSelectedIndex(cached, selected) : -1);
        setLoading(false);
        console.debug("CACHE HIT", key);
        return;
      }

      // 2) IN-FLIGHT DEDUPE
      const existing = inFlightRef.current.get(key);
      if (existing) {
        console.debug("IN-FLIGHT HIT", key);
        const requestId = Math.random().toString(36).slice(2);
        lastIssuedRef.current = requestId;
        setLoading(true);
        setIsOpen(true);
        setError(null);
        try {
          const mapped = await existing;
          if (lastIssuedRef.current !== requestId) return;
          setResults(mapped);
          setActiveIndex(selected ? findSelectedIndex(mapped, selected) : -1);
        } catch (err: any) {
          if (err?.name === "AbortError") return;
          if (lastIssuedRef.current !== requestId) return;
          setResults([]);
          setError("We couldn’t fetch suggestions. Please try again.");
          setIsOpen(true);
        } finally {
          if (lastIssuedRef.current === requestId) setLoading(false);
        }
        return;
      }

      // 3) NETWORK FETCH
      const controller = new AbortController();
      ctrlRef.current = controller;
      ctrlKeyRef.current = key;

      const requestId = Math.random().toString(36).slice(2);
      lastIssuedRef.current = requestId;

      setLoading(true);
      setIsOpen(true);
      setActiveIndex(-1);
      setError(null);

      // One shared Promise for in-flight dedupe
      const p = (async (): Promise<SuggestionItem[]> => {
        const { suggestions } = await autocompletePlacesAction(query, {
          sessionToken: tokenRef.current,
          includeQueryPredictions: false,
          inputOffset:
            typeof offset === "number" && offset <= query.length
              ? offset
              : undefined,
          signal: controller.signal,
        });

        const mapped: SuggestionItem[] = suggestions.map(
          (s: SuggestionItem) => ({
            kind: s.kind,
            text: s.text,
            secondaryText: s.secondaryText,
            placeId: s.placeId,
          })
        );

        cacheRef.current.set(key, mapped);
        return mapped;
      })();

      inFlightRef.current.set(key, p);
      console.debug("NETWORK FETCH", key);

      try {
        const mapped = await p;
        if (lastIssuedRef.current !== requestId) return;
        setResults(mapped);
        setActiveIndex(selected ? findSelectedIndex(mapped, selected) : -1);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        if (lastIssuedRef.current !== requestId) return;
        console.error("autocomplete error →", err);
        setResults([]);
        setError("We couldn’t fetch suggestions. Please try again.");
        setIsOpen(true);
      } finally {
        if (lastIssuedRef.current === requestId) setLoading(false);
        inFlightRef.current.delete(key);
        if (ctrlRef.current === controller) {
          ctrlRef.current = null;
          ctrlKeyRef.current = null;
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (tRef.current) {
        clearTimeout(tRef.current);
        tRef.current = null;
      }
      // (don’t abort here unless unmount; aborting per-key handled above)
    };
  }, [q, caret, selected]);

  // ── Selection (with Place Details; same session token, rotate after) ────────
  async function handleSelect(item: SuggestionItem) {
    if (!item) return;

    // Skip if this item is already selected (prevents duplicate API call)
    if (
      selected &&
      (selected.placeId ?? selected.placeId) === (item.placeId ?? item.placeId)
    ) {
      return;
    }

    // prevent the effect from firing due to programmatic setQ
    suppressFetchRef.current = true;

    setSelected(item);
    setQ(item.text);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();

    // cancel any autocomplete request
    if (ctrlRef.current) {
      ctrlRef.current.abort();
      ctrlRef.current = null;
      ctrlKeyRef.current = null;
    }

    if (error) {
      setError(null);
    }

    // fetch details
    let details: PlaceDetails | null = null;
    try {
      if (item.placeId) {
        setLoading(true);
        // language/region from browser if available
        const lang =
          (typeof navigator !== "undefined" && navigator.language) || "en";
        const [, maybeRegion] = lang.split("-");

        // separate controller for details
        if (detailsCtrlRef.current) detailsCtrlRef.current.abort();
        const detailsController = new AbortController();
        detailsCtrlRef.current = detailsController;

        details = await getPlaceDetailsAction(item.placeId, {
          languageCode: lang.split("-")[0] || "en",
          regionCode: maybeRegion,
          sessionToken: tokenRef.current,
          signal: detailsController.signal,
        });

        setSelectedDetails(details);
        setLoading(false);
      } else {
        setSelectedDetails(null);
      }
    } catch (err) {
      console.error("getPlaceDetailsAction failed →", err);
      setSelectedDetails(null);
    }

    // callback
    onPlaceSelected?.({
      inputText: item.text,
      suggestion: item,
      details,
      sessionToken: tokenRef.current,
    });

    // rotate token AFTER details
    tokenRef.current = newToken();

    // recents
    addRecent({
      kind: "place",
      text: item.text,
      secondaryText: item.secondaryText,
      placeId: item.placeId,
    });
    setRecents(loadRecents());
  }

  // ── Keyboard handling ───────────────────────────────────────────────────────
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (results.length > 0) {
        setIsOpen(true);
        if (selected) {
          const idx = findSelectedIndex(results, selected);
          setActiveIndex(
            idx >= 0 ? idx : e.key === "ArrowDown" ? 0 : results.length - 1
          );
        } else {
          setActiveIndex(e.key === "ArrowDown" ? 0 : results.length - 1);
        }
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (results.length === 0) return;
        setActiveIndex((prev) => (prev + 1 >= results.length ? 0 : prev + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (results.length === 0) return;
        setActiveIndex((prev) =>
          prev - 1 < 0 ? results.length - 1 : prev - 1
        );
        break;
      case "Enter":
        if (!isOpen) return;
        e.preventDefault();
        if (results.length === 0) return;
        handleSelect(activeIndex >= 0 ? results[activeIndex] : results[0]);
        break;
      case "Escape":
        if (!isOpen) return;
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  // ── Detect location (reverse geocode) ───────────────────────────────────────
  async function detectLocation() {
    try {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        return;
      }
      if (detecting) return;

      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setDetecting(true);
          try {
            const { latitude, longitude } = pos.coords;
            const res = await reverseGeocodeAction(latitude, longitude);

            const picked: SuggestionItem = {
              kind: "place",
              text: res.address ?? "",
              secondaryText: undefined,
              placeId: res.placeId ?? undefined,
            };

            if (tRef.current) {
              clearTimeout(tRef.current);
              tRef.current = null;
            }
            suppressFetchRef.current = true;
            setIsOpen(false);
            setActiveIndex(-1);
            setSelected(picked);
            setQ(picked.text);
            inputRef.current?.blur();
            addRecent(picked);
            setRecents(loadRecents());

            const fallbackDetails: PlaceDetails = {
              id: null,
              displayName: null,
              formattedAddress: res.address ?? null,
              location: res.location ?? { lat: latitude, lng: longitude },
              types: [],
            };
            setSelectedDetails(fallbackDetails);
            setError(null);
            setDetecting(false);

            onPlaceSelected?.({
              inputText: picked.text,
              suggestion: picked,
              details: fallbackDetails,
              sessionToken: tokenRef.current,
            });
            tokenRef.current = newToken();
            setApproximateLocationMessage(
              "Approximate location detected — check it and search manually if needed."
            );
          } catch (err) {
            console.error("Reverse geocoding failed →", err);
            setError("Could not detect location. Please try again.");
            setDetecting(false);
          }
        },
        (geoErr) => {
          console.error("Geolocation error", geoErr);
          let friendly = "We couldn’t access your location. Please try again.";
          switch (geoErr.code) {
            case geoErr.PERMISSION_DENIED:
              setGeoBlocked(true);
              friendly =
                "Location Permission Denied in your browser settings. We need to access your location from browser. Use this guide to allow location.";
              break;
            case geoErr.POSITION_UNAVAILABLE:
              friendly =
                "Your location is unavailable right now. Check your connection and try again.";
              break;
            case geoErr.TIMEOUT:
              friendly =
                "Locating took too long. Move to an open area or try again.";
              break;
          }
          setError(friendly);
          setDetecting(false);
        },
        { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
      );
    } catch (err) {
      console.error("Auto-detect click error", err);
      setError("Auto-detect failed. Please try again.");
      setDetecting(false);
    }
  }

  // ── helpers ─────────────────────────────────────────────────────────────────
  function findSelectedIndex(list: SuggestionItem[], sel: SuggestionItem) {
    return list.findIndex(
      (m) => (sel.placeId && m.placeId === sel.placeId) || m.text === sel.text
    );
  }
  function clearError() {
    setError(null);
  }
  function requestOpenRecents() {
    wantRecentsOpenRef.current = true;
  }

  return {
    // input
    q,
    setQ,
    caret,
    setCaret,
    // dropdown
    isOpen,
    setIsOpen,
    results,
    setResults,
    loading,
    activeIndex,
    setActiveIndex,
    error,
    setError,
    // selection
    selected,
    setSelected,
    selectedDetails,
    setSelectedDetails,
    handleSelect,
    // refs
    wrapRef,
    listRef,
    inputRef,
    // keyboard + detect
    onInputKeyDown,
    detectLocation,
    detecting,
    // recents
    recents,
    requestOpenRecents,
    // misc
    clearError,
    geoBlocked,
    setApproximateLocationMessage,
    approximateLocationMessage,
  };
}
