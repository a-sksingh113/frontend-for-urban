import * as React from "react";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

type Props = { title?: string; subtitle?: string };

export default function DashboardHeader({
  title = "Dashboard",
  subtitle = "Overview of your usage and plan",
}: Props) {
  return (
    <header className="space-y-1">
      <Heading as="h1">{title}</Heading>
      <Text className="text-slate-600">{subtitle}</Text>
    </header>
  );
}
