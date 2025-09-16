import { useEffect, useRef, useState } from "react";
import {
  autocompletePlacesAction,
  getPlaceDetailsAction,
  reverseGeocodeAction,
} from "@/actions/places";
import type {
  OnPlaceSelected,
  PlaceDetails,
  SuggestionItem,
} from "../components/molecules/pages/start/location-picker/types";
import { newToken } from "../components/molecules/pages/start/location-picker/utils";

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

export function usePlacesAutocomplete(onPlaceSelected?: OnPlaceSelected) {
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
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const tRef = useRef<number | null>(null);
  const suppressFetchRef = useRef(false);
  const tokenRef = useRef<string>(newToken());
  const lastIssuedRef = useRef<string>("");
  const wantRecentsOpenRef = useRef(false);

  useEffect(() => {
    if (!listRef.current || activeIndex < 0) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `#places-dropdown-option-${activeIndex}`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }
    if (tRef.current) {
      clearTimeout(tRef.current);
      tRef.current = null;
    }

    const query = q.trim();
    setError(null);

    if (!query || query.length < 3) {
      if (!query) tokenRef.current = newToken();

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

    tRef.current = window.setTimeout(async () => {
      const requestId = Math.random().toString(36).slice(2);
      lastIssuedRef.current = requestId;

      setLoading(true);
      setIsOpen(true);
      setActiveIndex(-1);

      try {
        const { suggestions } = await autocompletePlacesAction(query, {
          sessionToken: tokenRef.current,
          includeQueryPredictions: false,
          inputOffset: typeof caret === "number" ? caret : undefined,
        });

        if (lastIssuedRef.current !== requestId) return;

        const mapped: SuggestionItem[] = suggestions.map(
          (s: SuggestionItem) => ({
            kind: s.kind,
            text: s.text,
            secondaryText: s.secondaryText,
            placeId: s.placeId,
          })
        );

        setResults(mapped);
        if (selected) {
          const idx = mapped.findIndex(
            (m) =>
              (selected.placeId && m.placeId === selected.placeId) ||
              m.text === selected.text
          );
          setActiveIndex(idx);
        }
        setIsOpen(true);
      } catch (err) {
        // Only surface the error if this is still the latest request
        if (lastIssuedRef.current !== requestId) return;

        console.error("autocomplete error →", err);
        setResults([]);
        setIsOpen(true);
        setError("We couldn’t fetch suggestions. Please try again.");
      } finally {
        // Only clear loading for the latest request
        if (lastIssuedRef.current === requestId) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      if (tRef.current) clearTimeout(tRef.current);
    };
  }, [q, caret, selected]);

  useEffect(() => {
    setRecents(loadRecents());
  }, []);

  async function handleSelect(item: SuggestionItem) {
    if (!item) return;
    suppressFetchRef.current = true;
    setSelected(item);
    setQ(item.text);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();

    let details: PlaceDetails | null = null;
    try {
      if (item.placeId) {
        const lang =
          (typeof navigator !== "undefined" && navigator.language) || "en";
        const [, maybeRegion] = lang.split("-");
        details = await getPlaceDetailsAction(item.placeId, {
          languageCode: lang.split("-")[0] || "en",
          regionCode: maybeRegion,
          sessionToken: tokenRef.current,
        });
        setSelectedDetails(details);
      } else {
        setSelectedDetails(null);
      }
    } catch (err) {
      console.error("getPlaceDetailsAction failed →", err);
      setSelectedDetails(null);
    }

    onPlaceSelected?.({
      inputText: item.text,
      suggestion: item,
      details,
      sessionToken: tokenRef.current,
    });

    tokenRef.current = newToken();

    addRecent({
      kind: "place",
      text: item.text,
      secondaryText: item.secondaryText,
      placeId: item.placeId,
    });
    setRecents(loadRecents());
  }
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (results.length > 0) {
        setIsOpen(true);
        if (selected) {
          const idx = results.findIndex(
            (r) =>
              (selected.placeId && r.placeId === selected.placeId) ||
              r.text === selected.text
          );
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
        if (results.length === 0) return; // *** guard ***
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

  async function detectLocation() {
    try {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        return;
      }
      if (detecting) return;

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setDetecting(true);
          try {
            const { latitude, longitude } = pos.coords;
            const res = await reverseGeocodeAction(latitude, longitude);

            const picked = {
              kind: "place" as const,
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
            setDetecting(false);

            onPlaceSelected?.({
              inputText: picked.text,
              suggestion: picked,
              details: fallbackDetails,
              sessionToken: tokenRef.current,
            });
            tokenRef.current = newToken();
          } catch (err) {
            console.error("Reverse geocoding failed →", err);
            setError("Could not detect location. Please try again.");
            setDetecting(false);
          }
        },
        (geoErr) => {
          console.error("Geolocation error", geoErr);
          setError(geoErr.message || "Unable to access your location.");
        },
        { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
      );
    } catch (err) {
      console.error("Auto-detect click error", err);
      setError("Failed to auto-detect location.");
    }
  }

  function clearError() {
    setError(null);
  }
  function requestOpenRecents() {
    wantRecentsOpenRef.current = true;
  }

  return {
    q,
    setQ,
    caret,
    setCaret,
    isOpen,
    setIsOpen,
    setResults,
    results,
    loading,
    activeIndex,
    setActiveIndex,
    error,
    setError,
    selected,
    setSelected,
    selectedDetails,
    setSelectedDetails,
    wrapRef,
    listRef,
    handleSelect,
    onInputKeyDown,
    detectLocation,
    clearError,
    inputRef,
    recents,
    requestOpenRecents,
    detecting,
  };
}
