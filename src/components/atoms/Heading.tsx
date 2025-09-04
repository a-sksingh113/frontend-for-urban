import * as React from "react";
import { cn } from "@/lib/utils";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

export default function Heading({
  as: Component = "h2",
  className,
  children,
  ...rest
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "font-bold text-gray-900",
        Component === "h1" && "text-3xl sm:text-4xl",
        Component === "h2" && "text-2xl sm:text-3xl",
        Component === "h3" && "text-xl sm:text-2xl",
        Component === "h4" && "text-xl",
        Component === "h5" && "text-lg",
        Component === "h6" && "text-base",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
