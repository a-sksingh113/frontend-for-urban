import * as React from "react";
import { Heading, Text } from "@/components/atoms";

type Props = {
  text: React.ReactNode;
  subtext?: string;
  className?: string;
};

export function ResultTitle({ text, subtext, className }: Props) {
  return (
    <div className={className}>
      <Heading as="h1" className="mb-1">
        {text}
      </Heading>
      {subtext && <Text className="text-slate-600">{subtext}</Text>}
    </div>
  );
}
