import * as React from "react";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import InlineLink from "@/components/atoms/InlineLink";

type Props = {
  planName: string;
  price: string;
  onUpgradeHref?: string;
};

export default function PlanSummary({
  planName,
  price,
  onUpgradeHref = "/billing",
}: Props) {
  return (
    <Card className="p-4 space-y-3">
      <Heading as="h3" className="text-xl">
        Plan
      </Heading>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="font-medium">{planName}</p>
          <p className="text-sm text-slate-600">{price}</p>
        </div>
        <InlineLink href={onUpgradeHref} className="whitespace-nowrap">
          Upgrade →
        </InlineLink>
      </div>
    </Card>
  );
}
