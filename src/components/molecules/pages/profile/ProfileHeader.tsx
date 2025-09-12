import * as React from "react";
import Image from "next/image";
import type { User } from "@/types/user";

type Props = { user: User };

export function ProfileHeader({ user }: Props) {
  const createdAt = user.createdAt ? new Date(user.createdAt) : null;
  const displayName =
    user.fullName ?? (user.email ? user.email.split("@")[0] : null) ?? "—";
  const avatar = user.profilePhoto ?? null;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
        {avatar ? (
          <Image
            src={avatar}
            alt={displayName || "Avatar"}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="min-w-0">
        <div className="text-base font-semibold text-slate-900 truncate">
          {displayName}
        </div>
        <div className="text-xs text-slate-500">
          Account created: {createdAt ? createdAt.toLocaleDateString() : "—"}
        </div>
      </div>
    </div>
  );
}
