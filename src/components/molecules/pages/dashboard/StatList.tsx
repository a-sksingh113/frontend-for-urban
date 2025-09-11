import * as React from "react";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import { User } from "@/types/user";

type Props = {
  user: User;
};

function BoolChip({ value }: { value: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        value
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

export default function StatList({ user }: Props) {
  const stats = [
    { label: "Requests", value: user.requestCount },
    { label: "Used Tokens", value: user.tokenUsed },
    { label: "Remaining Tokens", value: user.tokensRemaining },
    {
      label: "Premium Access",
      value: <BoolChip value={user.hasPremiumAccess} />,
    },
    { label: "Verified", value: <BoolChip value={user.isVerified} /> },
  ];

  return (
    <Card>
      <div>
        <Heading as="h3" className="text-xl mb-2">
          Usage
        </Heading>
      </div>
      <ul className="space-y-3 divide-y divide-slate-200">
        {stats.map((s) => (
          <li
            key={s.label}
            className="flex items-baseline justify-between py-1.5"
          >
            <Text className="font-medium">{s.label}</Text>
            <Text className="text-slate-900">{s.value}</Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
