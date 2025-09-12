import { getUserProfile } from "@/actions/userData";
import { ProfileEditPage } from "@/components/organisms/pages/edit-profile/ProfileEditPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_middleware")?.value;
  const profile = token ? await getUserProfile() : null;

  if (!profile || !profile.user) {
    redirect("/login");
  }
  return <ProfileEditPage user={profile.user} />;
}
