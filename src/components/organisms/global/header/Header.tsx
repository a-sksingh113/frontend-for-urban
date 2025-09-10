import {
  AuthButtons,
  EmailVerificationNotice,
  Logo,
} from "@/components/molecules/global/header";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { cookies } from "next/headers";
import ProfileDropdown from "@/components/molecules/global/header/ProfileDropdown";
import { getUserProfile } from "@/actions/userData";

export async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_middleware")?.value;
  const profile = token ? await getUserProfile() : null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-transparent backdrop-blur">
      {!profile?.user.isVerified && token && (
        <EmailVerificationNotice email="gmail@.com" />
      )}
      <MaxWidthWrapper>
        <div className="flex h-13 md:h-14 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6">
            {profile ? (
              <ProfileDropdown tokenRemaining={profile?.user.tokensRemaining} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
