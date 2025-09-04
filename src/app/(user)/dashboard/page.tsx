import { Dashboard } from "@/components/organisms/pages/dashboard";
import type { StripeLog } from "@/components/molecules/pages/dashboard/StripeLogs";
import { cookies } from "next/headers";
import { getUserProfile } from "@/actions/userData";

function mockLogs(): StripeLog[] {
  const now = Date.now();
  const mk = (
    i: number,
    cycle: "monthly" | "payg",
    status: StripeLog["status"]
  ): StripeLog => ({
    id: `evt_${Math.random().toString(36).slice(2, 12)}`,
    cycle,
    event:
      i % 3 === 0
        ? "charge.succeeded"
        : i % 3 === 1
        ? "payment_intent.created"
        : "payout.paid",
    status,
    amount: 499 + i * 137,
    currency: "usd",
    createdAt: new Date(now - i * 3600_000 * 9),
    description:
      i % 2 ? "Customer subscription renewal" : "One-off job payment",
    customer: i % 2 ? "acme@example.com" : "jane@doe.dev",
  });

  return [
    mk(0, "monthly", "succeeded"),
    mk(1, "monthly", "pending"),
    mk(2, "monthly", "failed"),
    mk(3, "payg", "succeeded"),
    mk(4, "payg", "succeeded"),
    mk(5, "payg", "pending"),
  ];
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_middleware")?.value;
  const profile = token ? await getUserProfile() : null;

  const plan = { name: "Starter", price: "$10 / mo" };

  return <Dashboard user={profile?.user} plan={plan} logs={mockLogs()} />;
}
