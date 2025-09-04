"use client";

import * as React from "react";
import { Button, InlineLink } from "@/components/atoms";
import { cn } from "@/lib/utils";

type Props = {
  tel?: string;
  bookHref?: string;
  className?: string;
};

export function CardActions({ tel, bookHref, className }: Props) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {tel && (
        <Button asChild>
          <a href={`tel:${tel}`} aria-label="Call professional">
            Call
          </a>
        </Button>
      )}
      {bookHref && (
        <InlineLink href={bookHref} className="font-semibold">
          Book →
        </InlineLink>
      )}
    </div>
  );
}
