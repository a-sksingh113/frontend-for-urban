/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import StartStep from "./StartStep";
import { Input } from "@/components/atoms";
import { useCallback, useId } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";
import FieldError from "./location-picker/parts/FieldError";
import PlacesDropdown from "./location-picker/parts/PlacesDropdown";
import AutoDetectButton from "./location-picker/parts/AutoDetectButton";
import type { OnPlaceSelected } from "./location-picker/types";
import { X } from "lucide-react";

export default function LocationPicker({
  onPlaceSelected,
  onCleared,
}: {
  onPlaceSelected?: OnPlaceSelected;
  onCleared?: () => void;
} = {}) {
  const listboxReactId = useId();
  const listboxId = `places-dropdown-${listboxReactId}`;

  const {
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
    setSelectedDetails,
    // refs
    wrapRef,
    listRef,
    // actions
    handleSelect,
    onInputKeyDown,
    detectLocation,
    clearError,
    inputRef,
    requestOpenRecents,
    detecting,
  } = usePlacesAutocomplete(onPlaceSelected);

  useClickOutside(wrapRef, () => {
    setIsOpen(false);
    setActiveIndex(-1);
  });

  const onFocus = useCallback(() => {
    requestOpenRecents();
    const query = q.trim();
    if (!query) {
      const r =
        typeof window !== "undefined"
          ? JSON.parse(sessionStorage.getItem("places:recent") || "[]")
          : [];
      if (r.length > 0) {
        setResults(r);
        setActiveIndex(0);
        setIsOpen(true);
        return;
      }
    }
    if (query.length >= 3 && results.length > 0) {
      setIsOpen(true);
      if (selected) {
        const idx = results.findIndex(
          (r) =>
            (selected.placeId && r.placeId === selected.placeId) ||
            r.text === selected.text
        );
        if (idx >= 0) setActiveIndex(idx);
      }
    }
  }, [
    q,
    results,
    selected,
    setIsOpen,
    setActiveIndex,
    setResults,
    requestOpenRecents,
  ]);

  return (
    <StartStep
      step={2}
      title="Where do you need help?"
      subtitle="Your location helps us find pros in your area."
      className="space-y-3"
    >
      <div className="grid gap-3 md:grid-cols-5">
        <div className="md:col-span-4 relative" ref={wrapRef}>
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              if (error) clearError();
              setQ(e.target.value);
              try {
                setCaret(
                  (e.target as HTMLInputElement).selectionStart ?? undefined
                );
              } catch {}
            }}
            onFocus={onFocus}
            onKeyDown={onInputKeyDown}
            placeholder={
              detecting
                ? "Detecting your location..."
                : "Enter postal code or address"
            }
            className="flex-1 h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            role="combobox"
            aria-describedby={error ? "places-error" : undefined}
          />

          {selected && (
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setSelectedDetails?.(null);
                setQ("");
                requestOpenRecents();
                inputRef.current?.focus();
                onCleared?.();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear and show recent searches"
            >
              <X size={18} />
            </button>
          )}
          <FieldError id="places-error" message={error ?? ""} />

          <PlacesDropdown
            listboxId={listboxId}
            listRef={listRef}
            isOpen={isOpen}
            loading={loading}
            results={results}
            error={error}
            activeIndex={activeIndex}
            selected={selected}
            // onHover={setActiveIndex}
            onSelect={handleSelect}
          />
        </div>

        <div className="md:col-span-1">
          <AutoDetectButton
            loading={detecting}
            disabled={detecting}
            onClick={() => {
              clearError();
              detectLocation();
            }}
          />
        </div>
      </div>
    </StartStep>
  );
}
