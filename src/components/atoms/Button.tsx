import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  asChild,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: Props) {
  const Comp = asChild ? Slot : "button";

  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-shadow focus:outline-none focus-visible:ring-2 ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  } as const;
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-600/90 transition transition-colors duration-100 ease-in text-white focus-visible:ring-blue-600",
    secondary:
      "bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md focus-visible:ring-slate-400",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
    outline:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 focus-visible:ring-slate-400",
  } as const;

  return (
    <Comp
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    />
  );
}
