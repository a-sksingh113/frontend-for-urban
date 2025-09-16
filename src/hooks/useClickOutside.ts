import { useEffect } from "react";

/**
 * Accepts refs like RefObject<HTMLDivElement | null> OR RefObject<HTMLDivElement>
 * so callers don't have to change their useRef typings.
 */
export function useClickOutside<E extends HTMLElement>(
  ref: React.RefObject<E | null>,
  onOutside: () => void
) {
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const node = ref.current;
      if (!node) return;
      if (!node.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [ref, onOutside]);
}
