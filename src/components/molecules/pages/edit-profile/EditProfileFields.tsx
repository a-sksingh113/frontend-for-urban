"use client";
import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormField } from "@/components/molecules/global/form/FormField";
import type { z } from "zod";
import type { editProfileSchema } from "@/schemas/editProfileSchema";

type FormValues = z.input<typeof editProfileSchema>;

type Props = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
};

export function EditProfileFields({ register, errors }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        label="Full Name"
        placeholder="Jane Doe"
        registration={register("fullName", {
          maxLength: { value: 80, message: "Name is too long." },
        })}
        error={errors.fullName}
      />
      <FormField
        label="Phone"
        type="tel"
        placeholder="e.g. +1 555-555-5555"
        registration={register("phone", { maxLength: 40 })}
        error={errors.phone}
      />

      <FormField
        label="City"
        placeholder="City"
        registration={register("city", { maxLength: 60 })}
        error={errors.city}
      />
      <FormField
        label="State / Region"
        placeholder="State"
        registration={register("state", { maxLength: 60 })}
        error={errors.state}
      />
      <FormField
        label="Country"
        placeholder="Country"
        registration={register("country", { maxLength: 60 })}
        error={errors.country}
      />
      <FormField
        label="ZIP / Postcode"
        placeholder="ZIP / Postcode"
        registration={register("zipCode", { maxLength: 20 })}
        error={errors.zipCode}
      />
    </div>
  );
}
