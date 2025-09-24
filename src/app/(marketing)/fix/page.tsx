import { getUserHistory, getUserProfile } from "@/actions/userData";
import { Start } from "@/components/organisms/pages/start";
import { cookies } from "next/headers";

export const metadata = {
  title: "Start | FixAnything",
  description:
    "Upload a photo, auto-detect your location, and get matched with 3 vetted pros.",
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_middleware")?.value;
  const request = token ? await getUserHistory() : null;
  const profile = token ? await getUserProfile() : null;
  const tokensRemaining = Number(profile?.user?.tokensRemaining ?? 0);
  const outOfTokens = !!token && tokensRemaining <= 0;

  return (
    <Start
      token={token}
      request={request?.history}
      outOfTokens={outOfTokens}
      tokensRemaining={tokensRemaining}
    />
  );
}
