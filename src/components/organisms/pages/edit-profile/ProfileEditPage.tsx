"use client";
import * as React from "react";
import type { User } from "@/types/user";
import { EditProfileForm } from "@/components/molecules/pages/edit-profile";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Card, Heading } from "@/components/atoms";

type Props = {
  user: User;
};

export function ProfileEditPage({ user }: Props) {
  return (
    <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Card className="w-full max-w-3xl p-5 md:p-6 rounded-2xl border border-slate-200">
            <Heading as="h3" className="mb-4">
              Edit Profile
            </Heading>
            <EditProfileForm user={user} />
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
