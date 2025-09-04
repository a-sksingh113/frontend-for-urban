"use client";
import ConfirmationMessageResetPassword from "@/components/molecules/pages/auth/ConfirmationMessageResetPassword";
import { useParams } from "next/navigation";

export default function CheckYourEmailPage() {
  const params = useParams();
  const emailParam = params?.email;
  const email = emailParam ? decodeURIComponent(emailParam as string) : "";
  return <ConfirmationMessageResetPassword email={email} />;
}
