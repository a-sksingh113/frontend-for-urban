import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import {
  DashboardHeader,
  PlanSummary,
  ProfileOverview,
  StatList,
  StripeLogs,
} from "@/components/molecules/pages/dashboard";
import { StripeLog } from "@/components/molecules/pages/dashboard/StripeLogs";
import { User } from "@/types/user";
import { RequestsTable } from "../start";
import { HistoryItem } from "@/types/recentRequest";
import { Card, Heading } from "@/components/atoms";

type Props = {
  plan: { name: string; price: string };
  logs: StripeLog[];
  user?: User | null;
  request?: HistoryItem[];
};

export default function Dashboard({ plan, logs, user, request }: Props) {
  return (
    <section className="bg-white">
      <MaxWidthWrapper>
        <div className="py-6 md:py-10 space-y-6">
          <DashboardHeader />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {user && <ProfileOverview user={user} />}
              {user && <StatList user={user} />}
              {request && (
                <Card className="divide-y divide-slate-200">
                  <div className="p-4">
                    <Heading as="h3" className="text-xl mb-4">
                      My Previous Requests
                    </Heading>
                    <RequestsTable request={request} />
                  </div>
                </Card>
              )}
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
