/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import StartStep from "./StartStep";
import { Input, Spinner } from "@/components/atoms";
import { use, useCallback, useEffect, useId, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";
import FieldError from "./location-picker/parts/FieldError";
import PlacesDropdown from "./location-picker/parts/PlacesDropdown";
import AutoDetectButton from "./location-picker/parts/AutoDetectButton";
import type { OnPlaceSelected } from "./location-picker/types";
import { Info, X } from "lucide-react";
import { EnableLocationModal } from "./location-picker/EnableLocationModal";

export default function LocationPicker({
  onPlaceSelected,
  onCleared,
  onLoading,
}: {
  onPlaceSelected?: OnPlaceSelected;
  onCleared?: () => void;
  onLoading?: (loading: boolean) => void;
} = {}) {
  const listboxReactId = useId();
  const [open, setOpen] = useState(false);
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
    geoBlocked,
    setApproximateLocationMessage,
    approximateLocationMessage,
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && selected === null) {
      const el = e.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? start;
      const len = el.value.length;

      const singleCharDelete = start === end && start > 0 && len === 1;
      const allSelectedDelete = start === 0 && end === len;

      if (singleCharDelete || allSelectedDelete || len === 0) {
        e.preventDefault();
        clearAll();
        return;
      }
    }

    onInputKeyDown?.(e);
  }

  const clearAll = useCallback(() => {
    setSelected(null);
    setSelectedDetails?.(null);
    setQ("");
    requestOpenRecents();
    inputRef.current?.focus();
    onCleared?.();
  }, [
    setSelected,
    setSelectedDetails,
    setQ,
    requestOpenRecents,
    onCleared,
    inputRef,
  ]);

  useEffect(() => {
    onLoading?.(loading || detecting);
  }, [loading, detecting, onLoading]);

  return (
    <StartStep
      step={2}
      title="Where do you need help?"
      subtitle="Your location helps us find pros in your area."
      className="space-y-3"
    >
      <div className="grid gap-3 md:grid-cols-5">
        <div className="md:col-span-4 relative" ref={wrapRef}>
          <div className="relative">
            <Input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                const next = e.target.value;
                if (next.trim().length < 3) clearError();
                if (selected && next !== selected.text) {
                  setSelected(null);
                  setSelectedDetails?.(null);
                  onCleared?.();
                }
                if (selected && next === "") {
                  clearAll();
                  return;
                }

                setQ(next);
                try {
                  setCaret(
                    (e.target as HTMLInputElement).selectionStart ?? undefined
                  );
                } catch {}
              }}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              placeholder={
                detecting
                  ? "Detecting your location..."
                  : "Enter postal code or address"
              }
              className="flex-1 h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 pr-10 sm:pr-14"
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
            {loading && (
              <div className="absolute flex items-center justify-center right-3 top-1/2 -translate-y-1/2">
                <Spinner
                  size={18}
                  className="text-slate-400"
                  trackClassName="text-slate-500"
                />
              </div>
            )}

            {!loading && selected && (
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setSelectedDetails?.(null);
                  setQ("");
                  requestOpenRecents();
                  inputRef.current?.focus();
                  setApproximateLocationMessage("");
                  onCleared?.();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear and show recent searches"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <FieldError
            id="places-error"
            message={error ?? ""}
            onGuideOpen={() => setOpen(true)}
          />
          {approximateLocationMessage && (
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
              <Info size={16} />
              {approximateLocationMessage}
            </p>
          )}
          <EnableLocationModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onRetry={() => {
              setOpen(false);
            }}
            closeLabel="Close"
            retryLabel="Try again"
          />
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
            blocked={geoBlocked}
            onClick={() => {
              if (geoBlocked) {
                return;
              }
              detectLocation();
            }}
          />
        </div>
      </div>
    </StartStep>
  );
}
