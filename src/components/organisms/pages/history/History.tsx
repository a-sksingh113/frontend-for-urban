import * as React from "react";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Card, Heading } from "@/components/atoms";
import { HistoryItem } from "@/types/recentRequest";
import { RequestsTable } from "../start";

type Props = { request?: HistoryItem[] };

export default function History({ request }: Props) {
  return (
    <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Card className="w-full max-w-3xl rounded-2xl border-slate-200 p-6 shadow-sm">
            <Heading as="h2" className="mb-4">
              My Previous Requests
            </Heading>
            <RequestsTable request={request} />
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
