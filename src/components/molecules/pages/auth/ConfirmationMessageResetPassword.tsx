"use client";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { handleApiError } from "@/lib/handleApiError";
import { Button, Card } from "@/components/atoms";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

type Props = {
  email?: string;
};

const ConfirmationMessageResetPassword = ({ email }: Props) => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const hasEmail = Boolean(email);

  const onResend = async () => {
    if (!email) return;
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(
        res?.message ?? "If that email exists, we’ve sent a new reset link."
      );
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Card className="w-full max-w-md rounded-2xl border-slate-200 p-6 shadow-sm">
            {/* Icon badge */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              {/* simple mail + check icon (no external lib) */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-8 w-8"
                role="img"
              >
                <path
                  d="M20 8.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5l7.07 4.24a2 2 0 0 0 1.86 0L20 8.5Z"
                  fill="currentColor"
                  className="opacity-60"
                />
                <path
                  d="M20 6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2l8 4.8L20 6Z"
                  fill="currentColor"
                />
                <path
                  d="M16.5 9.5l-3.2 3.2-1.3-1.3"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
              Check your email
            </h2>

            {/* Subheader with bold email */}
            <p className="mt-2 text-center text-slate-700">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-slate-900 break-all">
                {email || "your email"}
              </span>
              .
            </p>

            {/* Info panel */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 border border-slate-100">
              <p>
                The email should arrive within a couple of minutes. Be sure to
                check your <span className="font-medium">spam</span> or{" "}
                <span className="font-medium">junk folder</span> just in case.
              </p>
              <p className="mt-3">
                Didn’t get the email? You can request a new link after a few
                minutes.
              </p>
            </div>

            {/* Resend CTA */}
            <Button
              type="button"
              onClick={onResend}
              disabled={!hasEmail || isLoading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-base font-semibold text-white
                   bg-blue-600 hover:bg-blue-600/90 disabled:bg-blue-300 focus:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-600/50 transition"
              aria-disabled={!hasEmail || isLoading}
            >
              {isLoading ? "Sending…" : "Resend Email"}
            </Button>

            {/* Back to login */}
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-blue-700 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ConfirmationMessageResetPassword;
