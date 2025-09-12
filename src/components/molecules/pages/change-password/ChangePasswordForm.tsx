"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/atoms";
import { ButtonWithLoading } from "@/components/molecules/global/reusable-ui";
import { ChangePasswordFields } from "@/components/molecules/pages/change-password";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/schemas/changePassword";

import { useChangePasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handleApiError";
import { useRouter } from "next/navigation";

export function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (values) => {
    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success("Password changed successfully");
      reset();
      router.push("/profile");
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ChangePasswordFields register={register} errors={errors} />
      <div className="flex gap-3 pt-2">
        <ButtonWithLoading
          size="md"
          isLoading={isSubmitting || isLoading}
          loadingText="Changing Password..."
        >
          Change Password
        </ButtonWithLoading>

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            router.push("/profile");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
