import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export default function Stat({ label, value, className }: Props) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
