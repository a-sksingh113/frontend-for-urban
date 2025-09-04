// src/actions/logout.ts
"use server";

import "server-only";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Cookie: cookieHeader,
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    // Best-effort: also clear local cookie so Next's layer is in sync immediately
    const store = await cookies();
    store.delete("token");
    store.delete("token_middleware");

    // You can inspect the response if you want to log it:
    // const data = await res.json().catch(() => ({}));
    // console.log('[logout response]', res.status, data);
  } catch (e) {
    console.error("Logout action error:", e);
    // Even if backend fails, clear local cookie and continue
    const store = await cookies();
    store.delete("token_middleware");
  }

  // Revalidate header + redirect to home (prevents flicker)
  revalidatePath("/", "layout");
  redirect("/login");
}
