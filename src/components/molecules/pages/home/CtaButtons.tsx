import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms";

export default function CtaButtons() {
  const startHref = "/start";
  const buyHref = "/pricing";
  const startLabel = "Start free";
  const buyLabel = "Buy tokens";

  return (
    <div className="flex w-full gap-2 md:w-auto">
      <Button asChild className="w-full md:w-auto" aria-label={startLabel}>
        <Link href={startHref}>{startLabel}</Link>
      </Button>

      <Button
        asChild
        variant="secondary"
        className="w-full md:w-auto"
        aria-label={buyLabel}
      >
        <Link href={buyHref}>{buyLabel}</Link>
      </Button>
    </div>
  );
}
