import * as React from "react";

type CtaMessageProps = {
  headline?: string;
  offer?: string;
  orText?: string;
  altOffer?: string;
  className?: string;
};

export default function CtaMessage({
  headline = "Start free →",
  offer = "First 3 matches on us",
  orText = "or",
  altOffer = "Buy 10 tokens for just £9 / $9",
  className = "",
}: CtaMessageProps) {
  return (
    <p className={`text-center text-sm md:text-base ${className}`}>
      <span className="font-semibold">{headline}</span> {offer}
      <span className="mx-2 text-slate-500">{orText}</span>
      <span className="font-semibold">{altOffer}</span>
    </p>
  );
}
