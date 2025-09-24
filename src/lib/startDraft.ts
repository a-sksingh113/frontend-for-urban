const KEY = "start:draft:file:v1";
const MAX_PERSIST_FILE_BYTES = 2 * 1024 * 1024; // 2MB safety net

export type PersistedFile = {
  name: string;
  type: string;
  dataUrl: string;
};

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export async function serializeFirstFile(
  files: File[]
): Promise<PersistedFile | null> {
  const f = files?.[0];
  if (!f) return null;
  if (f.size > MAX_PERSIST_FILE_BYTES) return null;
  return { name: f.name, type: f.type, dataUrl: await fileToDataUrl(f) };
}

export function saveFileDraft(file: PersistedFile | null) {
  try {
    if (!file) {
      sessionStorage.removeItem(KEY);
      return;
    }
    sessionStorage.setItem(KEY, JSON.stringify(file));
  } catch {}
}

export function loadFileDraft(): PersistedFile | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedFile;
  } catch {
    return null;
  }
}

export async function dataUrlToFile(persisted: PersistedFile): Promise<File> {
  const res = await fetch(persisted.dataUrl);
  const blob = await res.blob();
  return new File([blob], persisted.name, { type: persisted.type });
}

export function clearFileDraft() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
