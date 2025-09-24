import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function FieldError({
  id,
  message,
  guideHref = "/help/enable-location",
  onGuideOpen,
}: {
  id: string;
  message: string;
  guideHref?: string;
  onGuideOpen?: () => void;
}) {
  if (!message) return null;

  const allowIncluded = message.toLowerCase().includes("allow");

  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className="mt-2 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700"
    >
      <AlertTriangle
        className="h-4 w-4 shrink-0 text-red-600"
        aria-hidden="true"
      />
      <div className="flex-1">
        <p>{message}</p>

        {allowIncluded &&
          (onGuideOpen ? (
            <button
              type="button"
              onClick={onGuideOpen}
              className="inline-block underline underline-offset-2 hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 rounded cursor-pointer"
            >
              See how to enable it
            </button>
          ) : (
            <Link
              href={guideHref}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              See how to enable it
            </Link>
          ))}
      </div>
    </div>
  );
}
