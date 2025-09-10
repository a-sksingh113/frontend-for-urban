"use client";
import ConfirmationVerifyEmail from "@/components/molecules/pages/auth/ConfirmationVerifyEmail";
import { useParams } from "next/navigation";

export default function ConfirmEmail() {
  const params = useParams();
  const emailParam = params?.email;
  const email = emailParam ? decodeURIComponent(emailParam as string) : "";

  return <ConfirmationVerifyEmail email={email} />;
}
