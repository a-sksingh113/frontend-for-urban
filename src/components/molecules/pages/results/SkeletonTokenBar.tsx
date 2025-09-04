export function SkeletonTokenBar() {
  return (
    <div
      className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in"
      role="status"
      aria-busy="true"
    >
      {/* Label placeholder */}
      <div className="h-4 w-40 rounded skeleton shimmer" />

      {/* Button placeholder */}
      <div className="h-10 w-28 rounded-lg skeleton-strong shimmer" />

      <span className="sr-only">Loading token bar…</span>
    </div>
  );
}
