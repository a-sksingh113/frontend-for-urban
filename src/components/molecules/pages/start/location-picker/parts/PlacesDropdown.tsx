import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SuggestionItem } from "../types";

export default function PlacesDropdown({
  listboxId,
  listRef,
  isOpen,
  loading,
  results,
  error,
  activeIndex,
  selected,
  // onHover,
  onSelect,
}: {
  listboxId: string;
  listRef: React.RefObject<HTMLUListElement | null>;
  isOpen: boolean;
  loading: boolean;
  results: SuggestionItem[];
  error: string | null;
  activeIndex: number;
  selected: SuggestionItem | null;
  // onHover: (idx: number) => void;
  onSelect: (item: SuggestionItem) => void;
}) {
  if (!isOpen) return null;

  return (
    <ul
      id={listboxId}
      ref={listRef}
      role="listbox"
      aria-busy={loading ? "true" : "false"}
      className={cn(
        "absolute top-full left-0 mt-2 w-full z-50 bg-white border border-slate-200 rounded-lg shadow-lg transition-all duration-300 transform overflow-auto max-h-72"
      )}
      tabIndex={-1}
    >
      {/* Loading skeleton */}
      {loading && (
        <li role="status" aria-live="polite" className="py-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-2 px-4 py-3 border-b border-slate-100 last:border-b-0",
                i === 1 && "bg-slate-50"
              )}
            >
              <div className="h-4 w-4 rounded-full bg-slate-200 shimmer mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-2/3 bg-slate-200 rounded shimmer mb-1" />
                <div className="h-3 w-1/3 bg-slate-200 rounded shimmer" />
              </div>
            </div>
          ))}
        </li>
      )}

      {/* Results */}
      {!loading &&
        results.map((item, idx) => {
          const isFocused = idx === activeIndex;
          const isSelected =
            !!selected &&
            ((selected.placeId && item.placeId === selected.placeId) ||
              item.text === selected.text);

          return (
            <li
              id={`places-dropdown-option-${idx}`}
              key={`${item.text}-${idx}`}
              role="option"
              aria-selected={isSelected}
              className={cn(
                "flex w-full items-center sm:items-start gap-2 px-4 py-2 cursor-pointer",
                isSelected && "bg-blue-600 cursor-default",
                isFocused && "ring ring-slate-300",
                !isSelected && "hover:bg-gray-100"
              )}
              // onMouseEnter={() => onHover(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (isSelected) return;
                onSelect(item);
              }}
            >
              <MapPin
                className={cn(
                  "shrink-0 sm:mt-1.5 h-4 w-4",
                  isSelected ? "text-white" : "text-gray-500"
                )}
              />
              <div className="min-w-0">
                <div
                  className={cn(
                    "truncate text-sm",
                    isSelected ? "text-white" : "text-gray-900"
                  )}
                >
                  {item.text}
                </div>
                {item.secondaryText && (
                  <div
                    className={cn(
                      "truncate text-xs",
                      isSelected ? "text-blue-100" : "text-gray-500"
                    )}
                  >
                    {item.secondaryText}
                  </div>
                )}
              </div>
            </li>
          );
        })}

      {/* Empty state */}
      {!loading && results.length === 0 && isOpen && !error && (
        <li className="px-4 py-3 text-sm text-gray-500">No matches found</li>
      )}
    </ul>
  );
}
