"use client";
import * as React from "react";
import Image from "next/image";
import { Card, Heading, Button, Badge } from "@/components/atoms";
import type { User } from "@/types/user";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useResendVerifyEmailMutation } from "@/redux/api/authApi";
import { handleApiError } from "@/lib/handleApiError";
import { Edit, Lock } from "lucide-react";

type Props = { user?: User | null };

function Field({
  label,
  value,
  badge,
}: {
  label: string;
  value?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
      <div className="sm:w-40 md:w-48 shrink-0 text-[13px] sm:text-sm font-medium text-slate-500">
        {label}
      </div>
      <div className="sm:flex-1 flex flex-wrap items-center gap-1 sm:gap-2 text-[13px] sm:text-sm text-slate-800">
        {value ?? <span className="text-slate-400">Not provided</span>}
        {badge}
      </div>
    </div>
  );
}

export default function ProfileOverview({ user }: Props) {
  const [editing, setEditing] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [resend, { isLoading: isResending }] = useResendVerifyEmailMutation();

  if (!user) return null;

  const createdAt = user.createdAt ? new Date(user.createdAt) : null;
  const displayName =
    user.fullName ?? (user.email ? user.email.split("@")[0] : null) ?? "—";
  const avatar = user.profilePhoto ?? null;
  const emailVerified = user.isVerified ?? false;
  const locationLine = [user.city, user.state, user.country]
    .filter(Boolean)
    .join(", ");

  const openEdit = () => {
    setEditing(true);
    setShowChangePassword(false);
  };

  const openChangePassword = () => {
    setShowChangePassword(true);
    setEditing(false);
  };

  const handleResend = async () => {
    if (!user.email) return;
    try {
      await resend({ email: user.email }).unwrap();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      <Card className="p-5 md:p-6 rounded-2xl border border-slate-200">
        <Heading as="h3">Profile</Heading>

        <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr,1fr]">
          {/* Left: avatar + name */}
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
                Account created:{" "}
                {createdAt ? createdAt.toLocaleDateString() : "—"}
              </div>
            </div>
          </div>

          {/* Middle column: contact + verification */}
          <div className="grid gap-4">
            <Field
              label="Email Address"
              value={user.email}
              badge={
                <Badge
                  className="rounded-full"
                  variant={emailVerified ? "success" : "neutral"}
                >
                  {emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              }
            />

            {!emailVerified && user.email ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? "Sending…" : "Resend verification email"}
                </Button>
                <span className="text-xs text-slate-500">
                  Didn’t get it? Check spam or try again.
                </span>
              </div>
            ) : null}

            <Field
              label="Phone"
              value={user.phone ? <span>{user.phone}</span> : undefined}
            />
          </div>

          {/* Right column: address */}
          <div className="grid gap-4">
            <Field label="Location" value={locationLine || undefined} />
            <Field label="ZIP / Postcode" value={user.zipCode || undefined} />
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Profile actions"
          className="mt-5 flex flex-wrap gap-2"
        >
          <Button
            role="tab"
            aria-selected={editing}
            variant={editing ? "primary" : "secondary"}
            className={editing ? "ring-1 ring-blue-500" : "font-normal"}
            onClick={openEdit}
          >
            <Edit className="mr-2 w-5 h-5" />
            Edit Profile
          </Button>

          <Button
            role="tab"
            aria-selected={showChangePassword}
            variant={showChangePassword ? "primary" : "secondary"}
            className={
              showChangePassword ? "ring-1 ring-blue-500" : "font-normal"
            }
            onClick={openChangePassword}
          >
            <Lock className="mr-2 w-5 h-5" />
            Change Password
          </Button>
        </div>
      </Card>

      {editing && (
        <EditProfileForm
          user={user}
          onCancel={() => setEditing(false)}
          onSuccess={() => setEditing(false)}
        />
      )}

      {showChangePassword && (
        <ChangePasswordForm
          onSuccess={() => setShowChangePassword(false)}
          onCancel={() => setShowChangePassword(false)}
        />
      )}
    </>
  );
}
