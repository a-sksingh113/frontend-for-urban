"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Heading } from "@/components/atoms";
import { FormField } from "@/components/molecules/global/form/FormField";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handleApiError";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof changePasswordSchema>;

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ChangePasswordForm({ onSuccess, onCancel }: Props) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success("Password changed successfully");
      reset();
      onSuccess?.();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <Card className="p-5 md:p-6 rounded-2xl border border-slate-200">
      <Heading as="h3" className="mb-4">
        Change Password
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          autoComplete="current-password"
          registration={register("currentPassword")}
          error={errors.currentPassword}
        />

        <FormField
          label="New Password"
          type="password"
          placeholder="Enter new password"
          autoComplete="new-password"
          registration={register("newPassword")}
          error={errors.newPassword}
        />

        <FormField
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          autoComplete="new-password"
          registration={register("confirmNewPassword")}
          error={errors.confirmNewPassword}
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading
              ? "Changing Password..."
              : "Change Password"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
