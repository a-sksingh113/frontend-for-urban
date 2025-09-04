import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-full mx-auto lg:max-w-screen-xl lg:mx-auto px-3 sm:px-[24px]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
