/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
};

export default function Avatar({ src, alt, size = 64, className }: Props) {
  const s = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={s}
        className={cn(
          "rounded-lg object-cover ring-1 ring-slate-200",
          className
        )}
      />
    );
  }
  const initial = alt?.[0]?.toUpperCase() ?? "P";
  return (
    <div
      style={s}
      className={cn(
        "grid place-items-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200",
        className
      )}
      aria-label={alt}
    >
      {initial}
    </div>
  );
}
