"use client";
import SetPasswordForm from "@/components/molecules/pages/auth/SetPassWordForm";
import { useParams } from "next/navigation";

export default function SetPassword() {
  const { token } = useParams();
  const resetToken = token as string;

  return <SetPasswordForm resetToken={resetToken} />;
}
