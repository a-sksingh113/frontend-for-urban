export function SkeletonResultsHeader() {
  return (
    <div
      className="mx-auto max-w-5xl px-6 py-8 md:py-12 text-center animate-fade-in"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Title line */}
      <div className="h-8  max-w-[34rem] rounded skeleton-strong shimmer mx-auto" />

      {/* Subtitle line */}
      <div className="mt-3 h-4 w-56 md:w-80 rounded skeleton shimmer mx-auto" />

      <span className="sr-only">Loading results header…</span>
    </div>
  );
}
