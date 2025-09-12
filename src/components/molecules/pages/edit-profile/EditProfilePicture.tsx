"use client";
import * as React from "react";
import Image from "next/image";
import type { User } from "@/types/user";
import UserProfilePicUpload from "./UserProfilePicUpload";

type Props = {
  user: User;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

export function EditProfilePicture({ user, files, onFilesChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <UserProfilePicUpload files={files} onFilesChange={onFilesChange} />
      {user.profilePhoto && (
        <div className="flex justify-center items-center flex-col">
          <p className="inline-block text-sm font-medium text-slate-500 mb-1">
            Current Profile
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
  );
}
