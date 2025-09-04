import { Heading, Text } from "@/components/atoms";

type HeroHeadlineProps = {
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
};

export default function HeroHeadline({
  title,
  subtitle,
  className,
}: HeroHeadlineProps) {
  return (
    <div className={`text-center ${className ?? ""}`}>
      <Heading as="h1">{title}</Heading>
      {subtitle && (
        <Text muted className="mx-auto max-w-prose mt-3">
          {subtitle}
        </Text>
      )}
    </div>
  );
}
