import Button from "@/components/atoms/Button";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GetLeadsCTA({
  disabled,
  label = "Get 3 Leads",
}: {
  disabled: boolean;
  label?: string;
}) {
  return (
    <div className="mt-4 pt-4 flex justify-center items-center">
      <Button
        type="submit"
        size="lg"
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 transition-colors",
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <Users className="mr-2" size={20} /> {label}
      </Button>
    </div>
  );
}
