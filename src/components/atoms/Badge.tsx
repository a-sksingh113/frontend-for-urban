import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "success" | "neutral" | "warning";
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function Badge({
  children,
  variant = "neutral",
  className,
  ...rest
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium",
        variant === "success" && "border-green-200 bg-green-50 text-green-700",
        variant === "neutral" && "border-slate-200 bg-slate-50 text-slate-700",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-700",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
