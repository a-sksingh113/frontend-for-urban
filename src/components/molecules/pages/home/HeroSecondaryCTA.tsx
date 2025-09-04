import { Button } from "@/components/atoms";

type HeroSecondaryCTAProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function HeroSecondaryCTA({
  label = "Watch Video",
  onClick,
  className,
  size = "lg",
}: HeroSecondaryCTAProps) {
  return (
    <div className={`mx-auto w-full max-w-sm ${className ?? ""}`}>
      <Button
        variant="outline"
        size={size}
        onClick={onClick}
        className="w-full"
      >
        {label}
      </Button>
    </div>
  );
}
