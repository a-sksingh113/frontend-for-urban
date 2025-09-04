import * as React from "react";
import { Text, Card, IconWrap } from "@/components/atoms";

type StepProps = {
  index: number;
  title: string;
  body: string;
  icon: React.ReactNode;
  className?: string;
};

export default function Step({
  index,
  title,
  body,
  icon,
  className,
}: StepProps) {
  return (
    <li className={className}>
      <Card className="rounded-2xl border border-slate-200 shadow-sm h-full text-center p-6 md:p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-100">
        <IconWrap aria-hidden="true">{icon}</IconWrap>
        <span className="mt-3 text-sm inline-block text-slate-600 uppercase font-semibold">
          Step {index}{" "}
        </span>
        <p className="mt-1 text-lg font-semibold">
          <span className="sr-only">Step </span>
          {title}
        </p>
        <Text muted className="mt-2 mx-auto max-w-[36ch]">
          {body}
        </Text>
      </Card>
    </li>
  );
}
