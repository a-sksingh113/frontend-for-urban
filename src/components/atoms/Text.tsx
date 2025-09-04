import * as React from "react";
import { cn } from "@/lib/utils";

type TextProps = {
  muted?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
};

export default function Text({ muted, className, children, id }: TextProps) {
  return (
    <p
      className={cn(
        "text-sm md:text-base font-medium",
        muted ? "text-slate-600" : "text-slate-800",
        className
      )}
      id={id}
    >
      {children}
    </p>
  );
}
