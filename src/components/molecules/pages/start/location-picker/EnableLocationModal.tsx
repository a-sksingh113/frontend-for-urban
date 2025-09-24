"use client";

import * as React from "react";
import Image from "next/image";
import {
  Modal,
  type ModalProps,
} from "@/components/molecules/global/reusable-ui/Modal";
import Heading from "@/components/atoms/Heading";
import { RemoveScroll } from "react-remove-scroll";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms";
import { X } from "lucide-react";

const CARDS = [
  {
    key: "chrome",
    title: "Enable location in Chrome",

    screenshot: "/chrome.gif",
    icon: "/chrome-svgrepo-com.svg",
    steps: [
      "Click the lock icon in the address bar.",
      "Find Location and set it to Allow.",
      "Reload the page and try again.",
    ],
  },
  {
    key: "safari",
    title: "Enable location in Safari",

    screenshot: "/safari.gif",
    icon: "/safari-ios-svgrepo-com.svg",
    steps: [
      "Safari → Settings → Websites → Location.",
      "Find this site and choose Allow.",
      "Refresh the page.",
    ],
  },
  {
    key: "firefox",
    title: "Enable location in Firefox",

    screenshot: "/firefox.gif",
    icon: "/firefox-svgrepo-com.svg",
    steps: [
      "Click the shield/lock icon in the address bar.",
      "Under Permissions, allow Share Location.",
      "Reload the page.",
    ],
  },
  {
    key: "opera",
    title: "Enable location in Opera",

    screenshot: "/opera.gif",
    icon: "/opera-svgrepo-com.svg",
    steps: [
      "Click the lock icon in the address bar.",
      "Find Location and set it to Allow.",
      "Reload the page.",
    ],
  },
];

type EnableLocationModalProps = Omit<ModalProps, "children"> & {
  heading?: string;
  onRetry?: () => void;
  closeLabel?: string;
  retryLabel?: string;
};

export function EnableLocationModal({
  isOpen,
  onClose,
  heading = "How to enable location",
  closeLabel = "Close",
  className,
  ...rest
}: EnableLocationModalProps) {
  return (
    <RemoveScroll enabled={isOpen} removeScrollBar={isOpen} allowPinchZoom>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={cn(
          "relative w-[min(100%,1000px)] max-h-[95vh] lg:max-h-none rounded-xl bg-white px-6 md:px-8 pt-0 md:pt-2 shadow-xl",
          "overflow-y-auto overscroll-y-contain sm:overflow-visible",
          "focus:outline-none",
          className
        )}
        style={{ scrollbarGutter: "stable" }}
        {...rest}
      >
        <header
          className={cn(
            "sticky top-0 z-10 sm:static",
            "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80",
            "border-b border-slate-200",

            "-mx-6 md:-mx-8 px-6 md:px-8 py-3 mb-2"
          )}
        >
          <div className="relative flex items-center justify-center">
            <Heading as="h2" id="modal-title" className="m-0 text-center">
              {heading}
            </Heading>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="hidden md:flex absolute right-0 w-7 h-7 bg-slate-200 justify-center items-center rounded cursor-pointer text-gray-600 hover:bg-slate-300 transition duration-150 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Cards */}
        <div className={cn("grid gap-5", "sm:grid-cols-2")}>
          {CARDS.map((c) => (
            <article
              key={c.key}
              className={cn(
                "rounded-lg border border-slate-200 bg-white",
                "overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              )}
            >
              {/* screenshot */}
              <div className="relative h-40 w-full bg-slate-50 md:h-48">
                <Image
                  src={c.screenshot}
                  alt={`${c.title} screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority={false}
                  unoptimized
                />
              </div>

              <div className="p-5 bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                  <Image
                    src={c.icon}
                    alt={`${c.key} icon`}
                    width={35}
                    height={35}
                  />
                  <Heading
                    as="h4"
                    className="!text-lg font-semibold text-slate-900 tracking-tight"
                  >
                    {c.title}
                  </Heading>
                </div>

                <ol className="mt-3 list-decimal pl-5 space-y-1.5 text-sm sm:text-base leading-relaxed text-slate-600">
                  {c.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-2 -mx-6 md:-mx-8 px-6 md:px-8 py-3 sticky bottom-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-slate-200">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              {closeLabel}
            </Button>
          </div>
        </footer>
      </Modal>
    </RemoveScroll>
  );
}
