import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  withBadge?: boolean;
};

export function SkeletonResultCard({ className, withBadge = true }: Props) {
  return (
    <article
      className={cn("md:py-6 animate-fade-in", className)}
      aria-busy="true"
      role="status"
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Top image (16:9) */}
        <div className="relative aspect-[16/9] w-full skeleton shimmer" />

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title + badge row */}
          <div className="flex items-start justify-between gap-3">
            <div className="h-5 w-2/3 rounded skeleton-strong shimmer" />
            {withBadge && (
              <div className="h-6 w-24 rounded skeleton-subtle shimmer" />
            )}
          </div>

          {/* Rating + distance row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-4 w-10 rounded skeleton-strong shimmer" />
            <span className="h-4 w-3 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded skeleton-strong shimmer" />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3">
            <div className="h-10 w-full rounded-lg skeleton shimmer" />
            <div className="h-10 w-full rounded-lg skeleton shimmer" />
          </div>
        </div>
      </div>

      {/* Screen reader only status text */}
      <span className="sr-only">Loading content…</span>
    </article>
  );
}
