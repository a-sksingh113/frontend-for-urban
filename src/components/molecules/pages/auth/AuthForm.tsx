"use client";

import * as React from "react";
import Link from "next/link";
import { Button, OrSeparator, Text } from "@/components/atoms";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { GoogleButton } from "./GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupMutation, useLoginMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { handleApiError } from "@/lib/handleApiError";
import { loginSchema, signupSchema } from "@/schemas/authSchema";

type Props = {
  mode: "login" | "signup" | "password-reset";
};

type FormData = { email: string; password: string };

function getSafeNext(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) return decoded;
  } catch {}
  return null;
}

export function AuthForm({ mode }: Props) {
  const schema = mode === "signup" ? signupSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const searchParams = useSearchParams();
  const nextParam = React.useMemo(
    () => getSafeNext(searchParams?.get("next")),
    [searchParams]
  );

  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const isSubmitting = isSignupLoading || isLoginLoading;

  const handleFormSubmit = async (data: FormData) => {
    try {
      const formData = {
        email: data.email,
        password: data.password,
      };

      if (mode === "signup") {
        const response = await signup(formData).unwrap();
        if (response) {
          toast.success(response.message || "Signed up successfully!");
          router.push(`/confirm-email/${encodeURIComponent(data.email)}`);
        }
      } else {
        const response = await login(formData).unwrap();
        if (response) {
          toast.success(response.message || "Logged in successfully!");
          router.push(nextParam || "/");
          router.refresh();
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const primaryLabel = mode === "login" ? "Log in" : "Create account";
  const switchText =
    mode === "login" ? "Or sign up" : "Already have an account?";
  const switchHrefBase = mode === "login" ? "/signup" : "/login";
  const switchHref = nextParam
    ? `${switchHrefBase}?next=${encodeURIComponent(nextParam)}`
    : switchHrefBase;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <EmailField register={register} error={errors.email?.message} />
      </div>
      <div>
        <PasswordField
          id="password"
          register={register}
          error={errors.password?.message}
        />
      </div>
      {mode === "login" && (
        <div className="text-right -mt-2 mb-2">
          <Link
            href="/forgot-password"
            className="text-sm text-slate-600 font-semibold underline"
          >
            Forgot password?
          </Link>
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {primaryLabel}
      </Button>

      <div className="text-center">
        <Text className="text-sm text-slate-600">
          <Link href={switchHref} className="font-semibold underline">
            {switchText}
          </Link>
        </Text>
      </div>

      <OrSeparator />

      <GoogleButton />
    </form>
  );
}
