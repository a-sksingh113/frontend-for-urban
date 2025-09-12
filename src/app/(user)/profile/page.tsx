import { getUserProfile } from "@/actions/userData";
import { ProfileOverview } from "@/components/organisms/pages/profile";
import { cookies } from "next/headers";

export default async function UserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_middleware")?.value;
  const profile = token ? await getUserProfile() : null;

  return <ProfileOverview user={profile?.user} />;
}
