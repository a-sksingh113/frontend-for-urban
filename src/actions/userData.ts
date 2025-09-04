"use server";

import type { ProfileResponse } from "@/types/user";
import type { GetHistoryResponse } from "@/types/recentRequest";
import "server-only";
import { headers } from "next/headers";

// Fetch user profile
export async function getUserProfile(): Promise<ProfileResponse | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  const data: ProfileResponse = await res.json();

  if (!res.ok) {
    console.error("Profile fetch failed:", res.status, data);
    return null;
  }
  return data;
}

// Fetch user history (latest requests)
export async function getUserHistory(): Promise<GetHistoryResponse | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/history`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  const data: GetHistoryResponse = await res.json();

  if (!res.ok) {
    console.error("History fetch failed:", res.status, data);
    return null;
  }
  return data;
}
