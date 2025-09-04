import * as React from "react";
import { Card } from "@/components/atoms";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { CtaMessage, CtaButtons } from "@/components/molecules/pages/home";

export function CtaBar() {
  const ariaLabel = "Call to action";
  const message = {
    headline: "Start free →",
    offer: "First 3 matches on us",
    orText: "or",
    altOffer: "Buy 10 tokens for just £9 / $9",
  };

  return (
    <section className="py-4 md:py-8" role="region" aria-label={ariaLabel}>
      <MaxWidthWrapper>
        <Card className="mx-auto flex w-full flex-col items-center gap-3 md:flex-row md:justify-between">
          <CtaMessage {...message} />
          <CtaButtons />
        </Card>
      </MaxWidthWrapper>
    </section>
  );
}
