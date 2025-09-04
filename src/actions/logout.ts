"use server";

import "server-only";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    if (!backendUrl) {
      console.warn(
        "NEXT_PUBLIC_BACKEND_URL is not set; skipping backend logout call."
      );
    } else {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
        next: { revalidate: 0 },
      });
    }
  } catch (e) {
    console.error("Logout action error:", e);
  } finally {
    const store = await cookies();
    store.delete("token");
    store.delete("token_middleware");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
