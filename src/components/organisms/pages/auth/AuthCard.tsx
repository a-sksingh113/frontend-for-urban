import * as React from "react";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Card, Heading, Text } from "@/components/atoms";
import { AuthForm } from "@/components/molecules/pages/auth";
import { ResetPasswordForm } from "@/components/molecules/pages/auth/ResetPasswordForm";

type Props = {
  mode: "login" | "signup" | "password-reset";
};

export function AuthCard({ mode }: Props) {
  const title =
    mode === "login"
      ? "Welcome back"
      : mode === "signup"
      ? "Create your account"
      : "Reset your password";

  const subtitle =
    mode === "login"
      ? "Log in to continue and manage your requests."
      : mode === "signup"
      ? "Join to get matched with trusted pros."
      : "Enter your email to receive a password reset link.";

  return (
    <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Card className="w-full max-w-md rounded-2xl border-slate-200 p-6 shadow-sm">
            <div className="mb-4 text-center space-y-1.5">
              <Heading as="h2">{title}</Heading>
              <Text className="text-slate-600">{subtitle}</Text>
            </div>
            {mode !== "password-reset" ? (
              <AuthForm mode={mode} />
            ) : (
              <ResetPasswordForm />
            )}
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
