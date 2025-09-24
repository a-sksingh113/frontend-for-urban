"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setResults } from "@/redux/slices/searchResultsSlice";
import {
  selectPros,
  selectCategory,
  selectLocationLabel,
  selectTokenBalance,
} from "@/redux/slices/searchResultsSlice";
import { clearResults, readResults } from "@/lib/resultsCache";
import {
  ResultsSummary,
  ResultGrid,
} from "@/components/organisms/pages/results";
import {
  TokenBalance,
  EmptyState,
  SkeletonResultsHeader,
  SkeletonResultCard,
  SkeletonTokenBar,
} from "@/components/molecules/pages/results";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

export function ResultsClient() {
  const dispatch = useAppDispatch();
  const { response, isLoading, isError } = useAppSelector(
    (s) => s.searchResults
  );
  const pros = useAppSelector(selectPros);
  const category = useAppSelector(selectCategory);
  const locationLabel = useAppSelector(selectLocationLabel);
  const tokenBalance = useAppSelector(selectTokenBalance);

  const [checkedCache, setCheckedCache] = React.useState(false);

  React.useEffect(() => {
    if (!response) {
      const cached = readResults();
      if (cached) {
        dispatch(setResults(cached));
      } else {
        clearResults();
      }
    }
    setCheckedCache(true);
  }, [response, dispatch]);

  //  skeleton while checking cache
  if (!checkedCache || isLoading) {
    return (
      <div className="bg-white">
        <MaxWidthWrapper>
          <SkeletonResultsHeader />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonResultCard key={i} />
            ))}
          </div>
          <SkeletonTokenBar />
        </MaxWidthWrapper>
      </div>
    );
  }

  // EmptyState AFTER we've checked cache
  if (isError || pros.length === 0) {
    return (
      <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
        <MaxWidthWrapper>
          <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <EmptyState
              title="No nearby professionals found"
              subtitle="We couldn't find any matching pros in your area for the issue you shared. You can try again with a different location or submit a new request."
              ctaHref="/fix"
            />
          </div>
        </MaxWidthWrapper>
      </section>
    );
  }

  return (
    <>
      <ResultsSummary
        count={pros.length}
        category={category}
        locationLabel={locationLabel}
      />
      <ResultGrid items={pros} />
      <TokenBalance balance={tokenBalance} payHref="/billing" />
    </>
  );
}
