"use client";

import * as React from "react";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import InlineLink from "@/components/atoms/InlineLink";
import Text from "@/components/atoms/Text";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "payg";

export type StripeLog = {
  id: string;
  cycle: Cycle;
  event: string;
  status: "succeeded" | "pending" | "failed";
  amount: number;
  currency?: "usd" | "eur";
  createdAt: string | Date;
  description?: string;
  customer?: string;
};

type Props = {
  logs: StripeLog[];
  onOpenMonthly?: () => void;
  onOpenPayg?: () => void;
};

export default function StripeLogs({ logs, onOpenMonthly, onOpenPayg }: Props) {
  const [active, setActive] = React.useState<Cycle>("monthly");

  const filtered = React.useMemo(
    () => logs.filter((l) => l.cycle === active),
    [logs, active]
  );

  return (
    <Card className="p-4 space-y-4">
      <Heading as="h3" className="text-xl">
        Stripe Connect Logs
      </Heading>

      <div className="flex gap-2">
        <Button
          aria-pressed={active === "monthly"}
          onClick={() => {
            setActive("monthly");
            onOpenMonthly?.();
          }}
          className={cn(active === "monthly" && "ring-2 ring-blue-300")}
        >
          Monthly
        </Button>
        <Button
          aria-pressed={active === "payg"}
          onClick={() => {
            setActive("payg");
            onOpenPayg?.();
          }}
          className={cn(active === "payg" && "ring-2 ring-blue-300")}
        >
          Pay-as-you-go
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          {active === "monthly"
            ? "No monthly logs yet."
            : "No pay-as-you-go logs yet."}
        </div>
      ) : (
        <ul className="rounded border border-slate-200 divide-y divide-slate-200">
          {filtered.map((log) => (
            <li key={log.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Heading as="h5" className="font-semibold">
                    {prettyEvent(log.event)}
                  </Heading>
                  {log.description && (
                    <Text className="text-slate-600 mt-1">
                      {log.description}
                    </Text>
                  )}
                  <div className="mt-2 text-xs text-slate-500">
                    <span>{fmtMoney(log.amount, log.currency)}</span>
                    <span aria-hidden>&nbsp;•&nbsp;</span>
                    <time dateTime={new Date(log.createdAt).toISOString()}>
                      {fmtDate(log.createdAt)}
                    </time>
                    {log.customer && (
                      <>
                        <span aria-hidden>&nbsp;•&nbsp;</span>
                        <span>{log.customer}</span>
                      </>
                    )}
                    <span aria-hidden>&nbsp;•&nbsp;</span>
                    <span className="font-mono">{truncate(log.id, 10)}</span>
                  </div>
                </div>

                <StatusBadge status={log.status} />
              </div>

              <div className="mt-3">
                <InlineLink href="#" aria-label="Open in Stripe (mock)">
                  View in Stripe →
                </InlineLink>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ===== helpers ===== */

function fmtMoney(cents: number, currency: StripeLog["currency"] = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((cents ?? 0) / 100);
}

function fmtDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function truncate(s: string, n = 8) {
  if (s.length <= n) return s;
  const head = Math.ceil((n - 1) / 2);
  const tail = Math.floor((n - 1) / 2);
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

function prettyEvent(e: string) {
  return e.replace(/\./g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function StatusBadge({ status }: { status: StripeLog["status"] }) {
  const cls =
    status === "succeeded"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "pending"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-rose-50 text-rose-700 ring-rose-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 text-xs font-medium ring-1",
        cls
      )}
    >
      {status}
    </span>
  );
}
