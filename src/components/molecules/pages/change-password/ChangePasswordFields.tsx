import * as React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField } from "@/components/molecules/global/form/FormField";
import { ChangePasswordFormValues } from "@/schemas/changePassword";

type Props = {
  register: UseFormRegister<ChangePasswordFormValues>;
  errors: FieldErrors<ChangePasswordFormValues>;
};

export function ChangePasswordFields({ register, errors }: Props) {
  return (
    <>
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
    </>
  );
}
