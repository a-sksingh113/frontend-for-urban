import * as React from "react";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { ResultCard, EmptyState } from "@/components/molecules/pages/results";
import type { Pro } from "@/types/results";

type Props = {
  items: Pro[];
};

export function ResultGrid({ items }: Props) {
  return (
    <section className="bg-white">
      <MaxWidthWrapper>
        <div className="py-6">
          {items.length === 0 ? (
            <EmptyState
              title="No results found"
              subtitle="Try adjusting your location or search category."
              ctaHref="/start"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {items.map((p) => (
                <ResultCard key={p.id} {...p} />
              ))}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
