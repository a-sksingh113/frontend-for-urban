"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@/components/atoms";
import { EmailField } from "./EmailField";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handleApiError";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotSchema } from "@/schemas/authSchema";
import { ButtonWithLoading } from "@/components/molecules/global/reusable-ui";

type FormData = z.infer<typeof forgotSchema>;

export function ResetPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotSchema),
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async ({ email }: FormData) => {
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(
        res?.message ?? "If that email exists, we’ve sent a reset link."
      );
      reset();
      router.push(
        `/forgot-password/check-your-email/${encodeURIComponent(email)}`
      );
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <EmailField register={register} error={errors.email?.message} />
      <ButtonWithLoading
        className="w-full"
        isLoading={isLoading}
        loadingText="Sending…"
      >
        Send reset link
      </ButtonWithLoading>
      <div className="text-center">
        <Text className="text-sm text-slate-600">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold underline">
            Log in
          </Link>
        </Text>
      </div>
    </form>
  );
}
