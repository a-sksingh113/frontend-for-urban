import { AuthCard } from "@/components/organisms/pages/auth";

export const metadata = {
  title: "Log in — FixAnything",
  description: "Access your account to manage matches and bookings.",
};

export default function LoginPage() {
  return <AuthCard mode="login" />;
}
