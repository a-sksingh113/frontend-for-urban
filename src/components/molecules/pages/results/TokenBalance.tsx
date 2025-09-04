"use client";

import * as React from "react";
import { Card, Stat, Button } from "@/components/atoms";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

type Props = {
  balance: number;
  payHref?: string;
  onPay?: () => void;
  className?: string;
};

export function TokenBalance({ balance, payHref, onPay, className }: Props) {
  const Btn = (
    <Button onClick={onPay} asChild={!onPay && !!payHref}>
      {payHref ? <a href={payHref}>Pay Now</a> : <span>Pay Now</span>}
    </Button>
  );

  return (
    <section className="py-6 md:py-10">
      <MaxWidthWrapper>
        <Card
          className={cn("flex items-center justify-between p-4", className)}
        >
          <Stat label="Token Balance" value={balance} />
          {Btn}
        </Card>
      </MaxWidthWrapper>
    </section>
  );
}
