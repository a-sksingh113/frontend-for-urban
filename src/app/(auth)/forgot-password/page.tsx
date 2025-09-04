import { AuthCard } from "@/components/organisms/pages/auth";

export const metadata = {
  title: "Forgot Password — FixAnything",
  description:
    "Reset your FixAnything account password securely and regain access to your bookings and matches.",
};

export default function ForgotPassword() {
  return <AuthCard mode="password-reset" />;
}
