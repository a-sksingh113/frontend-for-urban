"use client";
import * as React from "react";

type Props = {
  label: string;
  value?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
};

export function Field({ label, value, badge, icon }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
      <div className="sm:w-40 md:w-48 shrink-0 flex items-center gap-2.5 text-[13px] sm:text-sm font-medium text-slate-500">
        {icon}
        {label}
      </div>
      <div className="sm:flex-1 flex flex-wrap items-center gap-1 sm:gap-2 text-[13px] sm:text-sm text-slate-800">
        {value ?? <span className="text-slate-400">Not provided</span>}
        {badge}
      </div>
    </div>
  );
}
