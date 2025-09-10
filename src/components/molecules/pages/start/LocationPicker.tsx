"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StartStep from "./StartStep";
import Button from "@/components/atoms/Button";
import { LocateFixed, Loader2 } from "lucide-react";
import { Input } from "@/components/atoms";
import {
  searchFakePlaces,
  type PlaceSuggestion,
  resolvePlaceByFreeText,
} from "@/lib/fakePlaces";

type LocationPickerProps = {
  postcode: string;
  onPostcodeChange: (postcode: string) => void;
  coords: { lat: number; lng: number } | null;
  onCoordsChange: (coords: { lat: number; lng: number } | null) => void;
  disabled: boolean;
};

export default function LocationPicker({
  postcode,
  onPostcodeChange,
  coords,
  onCoordsChange,
  disabled = false,
}: LocationPickerProps) {
  const [loadingDetect, setLoadingDetect] = useState(false);

  // Autocomplete state
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [highlight, setHighlight] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = "places-listbox";

  // Debounce the query
  const query = postcode;
  useEffect(() => {
    let active = true;
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      setHighlight(-1);
      return;
    }

    setIsSearching(true);
    const id = setTimeout(async () => {
      const results = await searchFakePlaces(query);
      if (!active) return;
      setSuggestions(results);
      setOpen(results.length > 0);
      setHighlight(results.length ? 0 : -1);
      setIsSearching(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(id);
    };
  }, [query]);

  // Close on click outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const commitSelection = (s: PlaceSuggestion) => {
    // Prefer a clean label (postcode if present), fall back to description
    onPostcodeChange(s.postcode ?? s.description);
    onCoordsChange({ lat: s.lat, lng: s.lng });
    setOpen(false);
  };

  const selectSuggestion = (s: PlaceSuggestion) => {
    commitSelection(s);
  };

  const tryResolveCurrentInput = async () => {
    const trimmed = postcode.trim();
    if (!trimmed) return false;
    const match = await resolvePlaceByFreeText(trimmed);
    if (match) {
      commitSelection(match);
      return true;
    }
    return false;
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // If list open & we have a highlighted suggestion, use it.
      if (open && suggestions.length && highlight >= 0) {
        selectSuggestion(suggestions[highlight]);
        return;
      }
      // Otherwise try resolving the free text (enables CTA on postcode/ZIP enter)
      await tryResolveCurrentInput();
      return;
    }

    if (!open || !suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    // If the blur is caused by clicking inside the dropdown, ignore.
    const next = e.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) return;

    // Auto-resolve on blur so users who type a postcode and click away still get coords.
    await tryResolveCurrentInput();
    setOpen(false);
  };

  const detect = () => {
    if (!("geolocation" in navigator)) return;
    setLoadingDetect(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const found = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onCoordsChange(found);
        onPostcodeChange(`Current location`);
        setLoadingDetect(false);
      },
      () => setLoadingDetect(false),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
  };

  const dropdown = useMemo(() => {
    if (!open) return null;
    return (
      <ul
        id={listboxId}
        role="listbox"
        className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md"
      >
        {suggestions.map((s, i) => {
          const active = i === highlight;
          return (
            <li
              key={s.id}
              role="option"
              aria-selected={active}
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(s)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                active ? "bg-blue-100" : "hover:bg-slate-50"
              }`}
            >
              <div className="font-medium">{s.description}</div>
              <div className="text-xs text-slate-500">
                lat: {s.lat.toFixed(5)} · lng: {s.lng.toFixed(5)}
              </div>
            </li>
          );
        })}
        {!suggestions.length && (
          <li className="px-3 py-2 text-sm text-slate-500">No results</li>
        )}
      </ul>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, suggestions, highlight]);

  return (
    <StartStep
      step={2}
      title="Where do you need help?"
      subtitle="Your location helps us find pros in your area."
      className="space-y-3"
    >
      <div className="grid gap-3 md:grid-cols-5">
        <div className="md:col-span-4 relative" ref={containerRef}>
          <Input
            value={postcode}
            onChange={(e) => {
              onPostcodeChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(suggestions.length > 0)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder="Enter postcode or address"
            className="w-full h-12 border border-slate-200 rounded-lg bg-white px-3 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
          />

          {/* Searching indicator */}
          {isSearching && open && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          )}

          {dropdown}
        </div>

        <div className="md:col-span-1">
          <Button
            type="button"
            onClick={detect}
            variant="secondary"
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-gray-100 text-black disabled:cursor-not-allowed"
            disabled={loadingDetect || disabled}
          >
            <LocateFixed className="h-4 w-4" />
            {loadingDetect ? "Detecting…" : "Auto-detect"}
          </Button>
        </div>
      </div>

      {coords && (
        <p className="text-xs text-gray-500">
          Selected: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </p>
      )}
    </StartStep>
  );
}
