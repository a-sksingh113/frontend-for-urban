import { AuthCard } from "@/components/organisms/pages/auth";

export const metadata = {
  title: "Sign up — FixAnything",
  description: "Create an account to get matched with trusted pros.",
};

export default function SignupPage() {
  return <AuthCard mode="signup" />;
}
