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
import { readResults } from "@/lib/resultsCache";
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

  // Prevent EmptyState flash: wait until we've checked sessionStorage
  const [checkedCache, setCheckedCache] = React.useState(false);

  React.useEffect(() => {
    if (!response) {
      const cached = readResults();
      if (cached) dispatch(setResults(cached));
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
      <div className="bg-white">
        <div className="mx-auto max-w-5xl p-6">
          <EmptyState
            title="No results to show"
            subtitle="Start a new request to see matched pros."
            ctaHref="/start"
          />
        </div>
      </div>
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
