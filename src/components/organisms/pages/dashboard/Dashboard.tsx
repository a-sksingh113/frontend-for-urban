import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import {
  DashboardHeader,
  PlanSummary,
  StatList,
  StripeLogs,
} from "@/components/molecules/pages/dashboard";
import { StripeLog } from "@/components/molecules/pages/dashboard/StripeLogs";
import { User } from "@/types/user";

type Props = {
  plan: { name: string; price: string };
  logs: StripeLog[];
  user?: User | null;
};

export default function Dashboard({ plan, logs, user }: Props) {
  return (
    <section className="bg-white">
      <MaxWidthWrapper>
        <div className="py-6 md:py-10 space-y-6">
          <DashboardHeader />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {user && <StatList user={user} />}
              <StripeLogs logs={logs} />
            </div>

            <aside className="space-y-6">
              <PlanSummary planName={plan.name} price={plan.price} />
              <div className="rounded border border-slate-200 p-4 text-sm text-slate-600">
                Tips and notices will appear here.
              </div>
            </aside>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
