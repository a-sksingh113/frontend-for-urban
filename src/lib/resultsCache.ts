import type { SubmitProblemResponse } from "@/types/problem";
const KEY = "fa:last-results";

export function saveResults(res: SubmitProblemResponse) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(res));
  } catch {}
}

export function readResults(): SubmitProblemResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SubmitProblemResponse) : null;
  } catch {
    return null;
  }
}

export function clearResults() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
