import * as React from "react";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { ResultTitle } from "@/components/molecules/pages/results";

type Props = {
  count: number;
  category: string;
  locationLabel: string;
};

export function ResultsSummary({ count, category, locationLabel }: Props) {
  return (
    <section className="bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="text-center py-8 md:py-12">
          <ResultTitle
            text={
              <>
                Found {count} {category} Near You
              </>
            }
            subtext={`Showing ranked results ${locationLabel}.`}
          />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
