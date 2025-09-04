import * as React from "react";

type Props = { label?: string };

export default function OrSeparator({ label = "or" }: Props) {
  return (
    <div className="my-3 flex items-center gap-3 text-sm text-slate-500">
      <span className="h-px w-full bg-slate-200" />
      <span className="shrink-0">{label}</span>
      <span className="h-px w-full bg-slate-200" />
    </div>
  );
}
