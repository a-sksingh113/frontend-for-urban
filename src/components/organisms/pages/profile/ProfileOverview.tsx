"use client";
import * as React from "react";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Card } from "@/components/atoms";
import type { User } from "@/types/user";

import {
  ProfileHeader,
  ProfileContact,
  ProfileAddress,
  ProfileActions,
} from "@/components/molecules/pages/profile";
import { useRouter } from "next/navigation";

type Props = { user?: User | null };

export default function ProfileOverview({ user }: Props) {
  const router = useRouter();
  if (!user) return null;

  return (
    <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Card className="w-full max-w-3xl rounded-2xl border-slate-200 p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-[220px,1fr,1fr]">
              <ProfileHeader user={user} />
              <ProfileContact user={user} />
              <ProfileAddress user={user} />
            </div>
            <ProfileActions
              onEdit={() => {
                router.push("/edit-profile");
              }}
              onChangePassword={() => {
                router.push("/change-password");
              }}
            />
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
