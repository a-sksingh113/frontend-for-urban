"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SpinnerProps = HTMLAttributes<SVGElement> & {
  /** Pixel size for width/height (overridden by Tailwind size classes if provided) */
  size?: number; // default 20
  /** Stroke thickness */
  strokeWidth?: number; // default 3
  /** Accessible label; hidden text will be announced to AT */
  label?: string; // e.g., "Loading"
  /** Extra class for the track circle */
  trackClassName?: string;
};

export default function Spinner({
  size = 20,
  strokeWidth = 3,
  className,
  trackClassName,
  label,
  ...rest
}: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-live={label ? "polite" : undefined}
      className="inline-flex"
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={cn(
          // spin normally; pause if user prefers reduced motion
          "animate-spin motion-reduce:animate-none",
          className
        )}
        aria-hidden={label ? "true" : "false"}
        {...rest}
      >
        {/* Track */}
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        {/* Head (rounded cap for a polished look) */}
        <path
          d="M21 12a9 9 0 0 0-9-9"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>

      {/* SR-only label for screen readers */}
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
