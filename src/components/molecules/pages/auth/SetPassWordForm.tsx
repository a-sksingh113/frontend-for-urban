"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handleApiError";
import { Button, Card, Input } from "@/components/atoms";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import Link from "next/link";
import { ButtonWithLoading } from "@/components/molecules/global/reusable-ui";

type FormValues = {
  password: string;
  confirmPassword: string;
};

type SetPasswordFormProps = {
  resetToken: string;
};

export default function SetPasswordForm({ resetToken }: SetPasswordFormProps) {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();

  const onSubmit = async ({ password }: FormValues) => {
    if (!resetToken) {
      toast.error("Reset token is missing.");
      return;
    }
    try {
      await resetPassword({ resetToken, password }).unwrap();
      toast.success("Password reset successful!");
      router.push("/login");
    } catch (err) {
      handleApiError(err);
    }
  };

  const submitting = isSubmitting || isLoading;

  return (
    <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Card className="w-full max-w-md rounded-2xl border-slate-200 p-6 md:p-8 shadow-sm">
            {/* Icon badge */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              {/* simple reset/lock icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-blue-600"
                aria-hidden="true"
              >
                <path
                  d="M12 1a7 7 0 0 1 6.4 4H20a1 1 0 1 1 0 2h-4V3a1 1 0 1 1 2 0v.1A5 5 0 1 0 17 12h2a7 7 0 1 1-7-11Z"
                  fill="currentColor"
                  opacity=".25"
                />
                <path
                  d="M7.5 14.5A2.5 2.5 0 0 1 10 12h4a2.5 2.5 0 0 1 2.5 2.5V18a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-3.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Heading + subtitle */}
            <h2 className="text-2xl text-center font-bold tracking-tight text-slate-900">
              Set new password
            </h2>
            <p className="mt-2 text-center text-slate-600">
              Your new password must be different from previously used
              passwords.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  aria-invalid={!!errors.password || undefined}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full h-12 border border-slate-200 rounded-lg bg-white px-3 outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-800">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  aria-invalid={!!errors.confirmPassword || undefined}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="w-full h-12 border border-slate-200 rounded-lg bg-white px-3 outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.confirmPassword?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <ButtonWithLoading
                className="w-full"
                isLoading={submitting}
                loadingText="Setting…"
              >
                Set Password
              </ButtonWithLoading>
            </form>

            {/* Back to login */}
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-slate-600 font-semibold underline"
              >
                Back to login
              </Link>
            </div>
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
