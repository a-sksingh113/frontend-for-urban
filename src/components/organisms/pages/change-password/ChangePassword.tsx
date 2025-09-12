"use client";

import { Card, Heading } from "@/components/atoms";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { ChangePasswordForm } from "@/components/molecules/pages/change-password";
import * as React from "react";

export default function ChangePassword() {
  return (
    <section className="h-full bg-gradient-to-b from-slate-100 to-slate-50">
      <MaxWidthWrapper>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Card className="w-full max-w-3xl rounded-2xl border-slate-200 p-6 shadow-sm">
            <Heading as="h3" className="mb-4">
              Change Password
            </Heading>

            <ChangePasswordForm />
          </Card>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
