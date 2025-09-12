import * as React from "react";
import { Badge, Button } from "@/components/atoms";
import type { User } from "@/types/user";
import { Field } from "./Field";
import { Mail, Phone } from "lucide-react";
import { useResendVerifyEmailMutation } from "@/redux/api/authApi";
import { handleApiError } from "@/lib/handleApiError";

type Props = { user: User };

export function ProfileContact({ user }: Props) {
  const [resend, { isLoading: isResending }] = useResendVerifyEmailMutation();
  const emailVerified = user.isVerified ?? false;

  const handleResend = async () => {
    if (!user.email) return;
    try {
      await resend({ email: user.email }).unwrap();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="grid gap-5">
      <Field
        icon={<Mail className="w-4.5 h-4.5" />}
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
        icon={<Phone className="w-4.5 h-4.5" />}
        label="Phone"
        value={user.phone ? <span>{user.phone}</span> : undefined}
      />
    </div>
  );
}
