"use client";
import * as React from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@/types/user";
import { handleApiError } from "@/lib/handleApiError";
import { editProfileSchema } from "@/schemas/editProfileSchema";
import { useUpdateProfileMutation } from "@/redux/api/authApi";

import { EditProfileFields } from "./EditProfileFields";
import { EditProfilePicture } from "./EditProfilePicture";
import { EditProfileActions } from "./EditProfileActions";

type Props = {
  user: User;
  onSuccess?: (u: Partial<User>) => void;
};

export function EditProfileForm({ user, onSuccess }: Props) {
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
      Object.entries(values).forEach(([key, val]) =>
        formData.append(key, val || "")
      );
      if (files.length > 0) formData.append("profilePhoto", files[0]);

      const res = await updateProfile(
        formData as unknown as Partial<User>
      ).unwrap();

      onSuccess?.(res.user ?? values);
      toast.success(res.message || "Profile updated");
      router.refresh();
      router.push("/profile");
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <EditProfileFields register={register} errors={errors} />
      <EditProfilePicture user={user} files={files} onFilesChange={setFiles} />
      <EditProfileActions
        isLoading={isSubmitting || isLoading}
        onCancel={() => {
          router.push("/profile");
        }}
      />
    </form>
  );
}
