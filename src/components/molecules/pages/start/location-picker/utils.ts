export function newToken() {
  try {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  } catch {
    return Math.random().toString(36).slice(2);
  }
}
