"use client";

import * as React from "react";

type Props = {
  open: boolean;
  locationLabel?: string; // e.g., "Kolkata" or "your area"
  onCancel?: () => void; // optional cancel
};

export default function SearchingOverlay({
  open,
  locationLabel = "your area",
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-slate-900/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Searching for local pros"
    >
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          {/* Header */}
          <div className="px-6 pt-6 text-center">
            <p className="text-sm font-medium text-blue-600">Working on it…</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Finding 3 ranked pros near{" "}
              <span className="text-blue-600">{locationLabel}</span>
            </h2>
            <p className="mt-2 text-slate-600">
              We’re analyzing your image and scanning trusted providers. Hang
              tight
              <AnimatedDots />
            </p>
          </div>

          {/* Animation */}
          <div className="px-6 py-8">
            <RadarAnimation />
          </div>

          {/* Progress + steps */}
          <div className="px-6 pb-6">
            <ProgressBar />

            <ul className="mt-4 space-y-2 text-sm">
              <StepItem label="Analyzing the issue" active />
              <StepItem label="Matching nearby pros" />
              <StepItem label="Ranking results for quality & distance" />
            </ul>

            <div className="mt-6 flex items-center justify-center gap-3">
              {onCancel ? (
                <button
                  onClick={onCancel}
                  className="h-10 rounded-lg border border-slate-300 px-4 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              ) : null}
              <span className="text-xs text-slate-500" aria-live="polite">
                This usually takes a few seconds.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Component-scoped animations */}
      <style jsx>{`
        @keyframes sweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulseOut {
          0% {
            transform: scale(0.7);
            opacity: 0.6;
          }
          70% {
            opacity: 0.15;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes rise {
          0% {
            transform: translateY(2px);
          }
          50% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(2px);
          }
        }
        @keyframes progress {
          0% {
            width: 10%;
          }
          30% {
            width: 45%;
          }
          60% {
            width: 75%;
          }
          100% {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
}

function AnimatedDots() {
  return (
    <span className="inline-flex">
      <span className="mx-0.5 animate-bounce [animation-delay:-0.2s]">.</span>
      <span className="mx-0.5 animate-bounce [animation-delay:-0.1s]">.</span>
      <span className="mx-0.5 animate-bounce">.</span>
    </span>
  );
}

function RadarAnimation() {
  return (
    <div className="relative mx-auto h-56 w-56">
      {/* expanding pulses */}
      <span className="absolute inset-0 rounded-full bg-blue-200 opacity-40 [animation:pulseOut_2s_ease-out_infinite]" />
      <span className="absolute inset-0 rounded-full bg-blue-100 opacity-30 [animation:pulseOut_2s_ease-out_infinite] [animation-delay:.5s]" />
      <span className="absolute inset-0 rounded-full bg-blue-50 opacity-30 [animation:pulseOut_2s_ease-out_infinite] [animation-delay:1s]" />

      {/* radar disc */}
      <div className="absolute inset-0 rounded-full border border-blue-200 bg-gradient-to-b from-blue-50 to-white" />

      {/* sweep arm */}
      <div className="absolute inset-0 origin-center [animation:sweep_2.6s_linear_infinite]">
        <div className="absolute left-1/2 top-1/2 h-[52%] w-[2px] -translate-x-1/2 -translate-y-full bg-blue-500/70 blur-[0.2px]" />
        <div className="absolute left-1/2 top-1/2 h-[52%] w-[6px] -translate-x-1/2 -translate-y-full bg-gradient-to-b from-blue-400/60 to-transparent opacity-70" />
      </div>

      {/* “pins” */}
      <Pin style={{ left: "22%", top: "35%", animationDelay: ".0s" }} />
      <Pin style={{ right: "20%", top: "25%", animationDelay: ".25s" }} />
      <Pin style={{ left: "35%", bottom: "18%", animationDelay: ".5s" }} />
      <Pin style={{ right: "28%", bottom: "22%", animationDelay: ".75s" }} />
    </div>
  );
}

function Pin(props: React.HtmlHTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn(
        "absolute inline-flex h-4 w-4 items-center justify-center",
        props.className
      )}
    >
      <span className="absolute h-4 w-4 rounded-full bg-blue-500/20 [animation:pulseOut_1.8s_ease-out_infinite]" />
      <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-400/40 [animation:rise_1.6s_ease-in-out_infinite]" />
    </span>
  );
}

// tiny helper (keeps this file self-contained)
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function ProgressBar() {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200">
      <div className="h-full bg-blue-600 [animation:progress_2.8s_ease-in-out_infinite]" />
    </div>
  );
}

function StepItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
          active
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-slate-300 bg-white text-slate-400"
        )}
        aria-hidden="true"
      >
        {active ? "●" : "○"}
      </span>
      <span className={active ? "text-slate-900" : "text-slate-500"}>
        {label}
      </span>
    </li>
  );
}
