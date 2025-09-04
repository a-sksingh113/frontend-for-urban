import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

type StepProps = {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Step({
  step,
  title,
  subtitle,
  children,
  className,
}: StepProps) {
  return (
    <div className={className}>
      <div className="mb-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
          {step}
        </div>
        <div>
          <Heading as="h3" className="text-xl text-gray-900">
            {title}
          </Heading>
          {subtitle && <Text className="text-gray-600 mt-0.5">{subtitle}</Text>}
        </div>
      </div>
      {children}
    </div>
  );
}
