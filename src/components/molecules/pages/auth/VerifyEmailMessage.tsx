import Link from "next/link";
import { verifyEmailOnServer } from "@/actions/verifyEmail";
import { InfoCircleIcon, VerifySealIcon } from "@/components/atoms/icons";

type Props = { token: string };

export default async function VerifyEmailMessage({ token }: Props) {
  const result = await verifyEmailOnServer(token);

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-slate-100 to-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center px-4 py-8">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div
            className={[
              "mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full",
              result.ok
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600",
            ].join(" ")}
            aria-hidden
          >
            {result.ok ? (
              <VerifySealIcon size={24} className="shrink-0" />
            ) : (
              <InfoCircleIcon size={24} className="shrink-0" />
            )}
          </div>
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            {result.ok ? "Email Verified!" : "Verification failed"}
          </h1>
          <p className="mt-2 text-center text-slate-700">
            {result.message ??
              (result.ok
                ? "Your email has been successfully verified. You can now access all features."
                : "The link may be invalid or expired. Please request a new verification email and try again.")}
          </p>

          <div className="mt-6 text-center">
            {result.ok && (
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-600/90 focus-visible:ring-2 focus-visible:ring-blue-600/50"
              >
                Back to Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
