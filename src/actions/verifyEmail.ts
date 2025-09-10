"use server";

type VerifyEmailOk = { ok: true; message?: string };
type VerifyEmailErr = { ok: false; message?: string; status: number };

export async function verifyEmailOnServer(
  token: string
): Promise<VerifyEmailOk | VerifyEmailErr> {
  try {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
    const res = await fetch(
      `${base}/api/auth/verify-email/${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        message: data?.message ?? "Verification failed.",
        status: res.status,
      };
    }
    return {
      ok: true,
      message: data?.message ?? "Your email has been successfully verified.",
    };
  } catch {
    return {
      ok: false,
      message: "Unable to contact verification service.",
      status: 0,
    };
  }
}
