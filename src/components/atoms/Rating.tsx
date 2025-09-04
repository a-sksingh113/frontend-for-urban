import * as React from "react";

type Props = {
  value: number;
  count?: number;
  className?: string;
};

export default function Rating({ value, count, className }: Props) {
  const rounded = Math.round(value * 10) / 10;
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(value) ? "★" : "☆"
  ).join("");
  return (
    <span className={className} aria-label={`${rounded} out of 5`}>
      <span className="font-medium text-yellow-600">{stars}</span>{" "}
      <span className="align-middle text-sm text-slate-700">{rounded}</span>
      {typeof count === "number" && (
        <span className="text-xs text-slate-500"> ({count})</span>
      )}
    </span>
  );
}
