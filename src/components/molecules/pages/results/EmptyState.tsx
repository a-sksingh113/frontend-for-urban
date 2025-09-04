import * as React from "react";
import { Card, Heading, Text, Button } from "@/components/atoms";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  ctaHref?: string;
};

export function EmptyState({ title, subtitle, ctaHref }: Props) {
  return (
    <Card className="grid place-items-center gap-2 p-10 text-center">
      <Heading as="h3">{title}</Heading>
      {subtitle && (
        <Text className="max-w-prose text-slate-600">{subtitle}</Text>
      )}
      {ctaHref && (
        <Button asChild className="mt-2">
          <Link href={ctaHref}>Try another search</Link>
        </Button>
      )}
    </Card>
  );
}
