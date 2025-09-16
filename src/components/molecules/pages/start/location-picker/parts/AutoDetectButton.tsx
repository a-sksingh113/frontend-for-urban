import Button from "@/components/atoms/Button";
import { LocateFixed } from "lucide-react";
import * as React from "react";

type Props = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function AutoDetectButton({
  onClick,
  loading = false,
  disabled = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full h-11 inline-flex items-center justify-center gap-2 bg-gray-100 text-black disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-live="polite"
    >
      <span className="relative inline-flex items-center justify-center">
        {/* pulsing ring while loading */}
        {loading && (
          <span
            className="absolute h-4 w-4 rounded-full ring ring-current animate-ping"
            aria-hidden="true"
          />
        )}
        <LocateFixed
          className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
      </span>
      <span>{loading ? "Auto-detect..." : "Auto-detect"}</span>
      {/* screen readers get an explicit status word when loading */}
      {loading && <span className="sr-only">Locating your position</span>}
    </Button>
  );
}
