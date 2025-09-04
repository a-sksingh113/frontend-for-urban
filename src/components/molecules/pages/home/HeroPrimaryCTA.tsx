import { Button } from "@/components/atoms";
import { Search } from "lucide-react";
import Link from "next/link";

type HeroPrimaryCTAProps = {
  label: string;
  onClick?: () => void;
  href: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function HeroPrimaryCTA({
  label,
  href,
  className,
  size = "lg",
}: HeroPrimaryCTAProps) {
  return (
    <div className={`mx-auto w-full max-w-sm ${className ?? ""}`}>
      <Button
        asChild
        size={size}
        className="w-full shadow-blue-600/30 flex gap-x-1.5"
      >
        <Link href={href}>
          <Search className="size-5" /> {label}
        </Link>
      </Button>
    </div>
  );
}
