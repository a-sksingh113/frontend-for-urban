import * as React from "react";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Card } from "@/components/atoms";

type Props = {
  isLoading?: boolean;
  children: React.ReactNode;
};

export function ResultsShell({ isLoading, children }: Props) {
  if (!isLoading) return <>{children}</>;
  return (
    <section>
      <MaxWidthWrapper>
        <div className="py-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="grid grid-cols-[80px,1fr] gap-4 p-4">
              <div className="h-20 w-20 animate-pulse rounded-lg bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              </div>
            </Card>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
