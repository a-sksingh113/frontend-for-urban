import { getUserHistory } from "@/actions/userData";
import History from "@/components/organisms/pages/history/History";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_middleware")?.value;
  const request = token ? await getUserHistory() : null;

  return <History request={request?.history} />;
}
