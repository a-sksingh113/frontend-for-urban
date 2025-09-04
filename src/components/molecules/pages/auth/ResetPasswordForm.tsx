"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text } from "@/components/atoms";
import { EmailField } from "./EmailField";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handleApiError";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotSchema } from "@/schemas/authSchema";

type FormData = z.infer<typeof forgotSchema>;

export function ResetPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
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
      router.push(
        `/forgot-password/check-your-email/${encodeURIComponent(email)}`
      );
      router.refresh();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <EmailField register={register} error={errors.email?.message} />

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? "Sending…" : "Send reset link"}
      </Button>

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
