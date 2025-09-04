import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

type InlineLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function InlineLink({
  href,
  children,
  className,
}: InlineLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "underline decoration-blue-600 underline-offset-2 hover:text-blue-700",
        className
      )}
    >
      {children}
    </Link>
  );
}
