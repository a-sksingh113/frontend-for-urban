"use client";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import { FindProForm } from "@/components/molecules/pages/start";
import { RequestsTable } from "@/components/organisms/pages/start";
import { HistoryItem } from "@/types/recentRequest";
import Link from "next/link";

export default function Start({
  request,
  token,
  outOfTokens,
  tokensRemaining,
}: {
  request?: HistoryItem[];
  token: string | undefined;
  outOfTokens: boolean;
  tokensRemaining: number;
}) {
  console.log(request);
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-50 to-white">
      <MaxWidthWrapper>
        <section className="py-10 md:py-14">
          <div className="mb-10 text-center">
            <Heading as="h1">Get 3 Ranked Pros in Minutes</Heading>
            <Text className="mt-2 text-gray-600">
              Snap what needs fixing, auto-detect your location, and we’ll match
              you with trusted pros.
            </Text>
          </div>
          {/* Optional credit banner */}
          {token && (
            <div
              className={`mb-5 rounded-md border px-4 py-3 text-sm ${
                outOfTokens
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {outOfTokens ? (
                <>
                  You’re out of credits. Please{" "}
                  <Link href="/billing" className="underline">
                    buy tokens or upgrade
                  </Link>{" "}
                  to continue.
                </>
              ) : (
                <>Credits remaining: {tokensRemaining}</>
              )}
            </div>
          )}
          <FindProForm token={token} outOfTokens={outOfTokens} />
        </section>
        {token && (
          <section className="py-8 md:py-12 border-t border-slate-200">
            <Heading as="h2" className="mb-4">
              My Previous Requests
            </Heading>
            <RequestsTable request={request} />
          </section>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
