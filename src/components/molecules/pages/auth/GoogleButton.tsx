"use client";

import * as React from "react";
import { Button } from "@/components/atoms";
import { GoogleIcon } from "@/components/atoms/icons";

export function GoogleButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
    >
      <span className="inline-flex items-center justify-center gap-2">
        <GoogleIcon className="h-5 w-5" />
        <span>Continue with Google</span>
      </span>
    </Button>
  );
}
