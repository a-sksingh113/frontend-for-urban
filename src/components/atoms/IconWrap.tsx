import * as React from "react";
import { cn } from "@/lib/utils";

type IconWrapProps = {
  className?: string;
  children: React.ReactNode;
};

export default function IconWrap({ children, className }: IconWrapProps) {
  return (
    <div
      className={cn(
        "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50",
        className
      )}
    >
      {children}
    </div>
  );
}
