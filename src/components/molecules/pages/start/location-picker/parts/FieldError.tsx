import { AlertTriangle } from "lucide-react";

export default function FieldError({
  id,
  message,
}: {
  id: string;
  message: string;
}) {
  if (!message) return null;
  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className="mt-2 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
    >
      <AlertTriangle className="h-4 w-4" />
      {message}
    </div>
  );
}
