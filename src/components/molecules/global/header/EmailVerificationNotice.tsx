"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useResendVerifyEmailMutation } from "@/redux/api/authApi";
import { EmailWarningIcon } from "@/components/atoms/icons";
import { X } from "lucide-react";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

export type EmailVerificationNoticeProps = {
  email: string;
  message?: string;
  shortMessage?: string;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
  dismissible?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function EmailVerificationNotice({
  email,
  message = "Your email address is not verified. Please check your inbox for a confirmation link.",
  shortMessage = "Your email is not verified",
  onSuccess,
  onError,
  dismissible = false,
  className,
  ...rest
}: EmailVerificationNoticeProps) {
  const [visible, setVisible] = React.useState(true);
  const [resend, { isLoading, isSuccess, isError }] =
    useResendVerifyEmailMutation();

  const handleResend = async () => {
    try {
      await resend({ email }).unwrap();
      onSuccess?.();
    } catch (e) {
      onError?.(e);
    }
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "w-full border-y border-amber-300 bg-amber-100",
        "text-amber-900",
        "px-2 md:px-3 sm:px-4 py-2 sm:py-2.5",
        "flex items-start sm:items-center gap-3 sm:gap-4",
        className
      )}
      {...rest}
    >
      <MaxWidthWrapper className="flex items-center gap-x-2">
        <EmailWarningIcon
          aria-hidden="true"
          className="mt-0.5 sm:mt-0 shrink-0 text-amber-600"
          size={22}
        />

        <p className="min-w-0 text-xs sm:text-sm leading-6">
          <span className="sm:hidden line-clamp-1">{shortMessage}</span>
          <span className="hidden sm:inline">{message}</span>
        </p>

        <div className="flex items-center gap-0.5 md:gap-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className={cn(
              "text-xs md:text-sm font-semibold underline underline-offset-4 cursor-pointer",
              "hover:opacity-90 focus:outline-none focus-visible:ring",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? "Sending…" : "Resend"}
          </button>

          {dismissible && (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setVisible(false)}
              className="rounded p-1 hover:bg-amber-100 cursor-pointer focus-visible:ring flex items-center"
            >
              <X aria-hidden size={18} />
            </button>
          )}
        </div>
      </MaxWidthWrapper>
      {(isSuccess || isError) && (
        <span className="sr-only">
          {isSuccess
            ? "Verification email sent."
            : "Failed to send verification email."}
        </span>
      )}
    </div>
  );
}
