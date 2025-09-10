"use client";
import React from "react";
import { toast } from "sonner";
import { useResendVerifyEmailMutation } from "@/redux/api/authApi";
import { handleApiError } from "@/lib/handleApiError";
import { Button, Card } from "@/components/atoms";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { EmailVerifyIcon } from "@/components/atoms/icons";

type Props = {
  email?: string;
};

const ConfirmationVerifyEmail = ({ email }: Props) => {
  const [resendVerifyEmail, { isLoading }] = useResendVerifyEmailMutation();
  const hasEmail = Boolean(email);

  const onResend = async () => {
    if (!email) return;
    try {
      const res = await resendVerifyEmail({ email }).unwrap();
      toast.success(
        res?.message ??
          "If that email exists, we’ve sent a new verification link."
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
              <EmailVerifyIcon className="h-8 w-8 text-[#0080ff]" />
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
              Confirm your email
            </h2>

            {/* Subheader */}
            <p className="mt-2 text-center text-slate-700">
              We&apos;ve sent a confirmation email to <br />
              <span className="font-semibold text-slate-900 break-all">
                {email || "your email"}
              </span>
              . Please check your inbox and click the link to complete your
              registration.
            </p>

            {/* Info panel */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 border border-slate-100">
              <p>
                The email should arrive within a couple of minutes. Be sure to
                check your <span className="font-medium">spam</span> or{" "}
                <span className="font-medium">junk folder</span> just in case.
              </p>
              <p className="mt-3">
                Didn’t get the email? You can request a new link by clicking on{" "}
                <span className="font-semibold text-slate-900 break-all">
                  Resend Email
                </span>{" "}
                below
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
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ConfirmationVerifyEmail;
