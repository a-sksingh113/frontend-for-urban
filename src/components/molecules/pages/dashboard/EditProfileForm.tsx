"use client";

import * as React from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, Button, Heading } from "@/components/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@/types/user";
import { handleApiError } from "@/lib/handleApiError";
import { FormField } from "@/components/molecules/global/form/FormField";
import { editProfileSchema } from "@/schemas/editProfileSchema";
import { useUpdateProfileMutation } from "@/redux/api/authApi";
import { ButtonWithLoading } from "@/components/molecules/global/reusable-ui";
import UserProfilePicUpload from "./UserProfilePicUpload";
import Image from "next/image";

type Props = {
  user: User;
  onCancel: () => void;
  onSuccess?: (u: Partial<User>) => void;
};

export default function EditProfileForm({ user, onCancel, onSuccess }: Props) {
  const router = useRouter();
  const [files, setFiles] = React.useState<File[]>([]);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  type FormValues = z.input<typeof editProfileSchema>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user.fullName ?? undefined,
      phone: user.phone ?? undefined,
      city: user.city ?? undefined,
      state: user.state ?? undefined,
      country: user.country ?? undefined,
      zipCode: user.zipCode ?? undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName || "");
      formData.append("phone", values.phone || "");
      formData.append("city", values.city || "");
      formData.append("state", values.state || "");
      formData.append("country", values.country || "");
      formData.append("zipCode", values.zipCode || "");

      if (files.length > 0) {
        formData.append("profilePhoto", files[0]);
      }

      const res = await updateProfile(
        formData as unknown as Partial<User>
      ).unwrap();

      onSuccess?.(res.user ?? values);
      toast.success(res.message || "Profile updated");
      router.refresh();
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <Card className="p-5 md:p-6 rounded-2xl border border-slate-200">
      <Heading as="h3" className="mb-4">
        Edit Profile
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <UserProfilePicUpload files={files} onFilesChange={setFiles} />

          {user.profilePhoto && (
            <div className="flex justify-center items-center flex-col">
              <p className="text-sm text-muted-foreground mb-1">
                Current Profile Picture
              </p>
              <Image
                src={user.profilePhoto}
                alt="Current profile"
                className="w-24 h-24 rounded-full border border-gray-500 object-cover"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <ButtonWithLoading
            size="md"
            isLoading={isSubmitting || isLoading}
            loadingText="Updating..."
          >
            Save Changes
          </ButtonWithLoading>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
