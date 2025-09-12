"use client";

import * as React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/atoms";

type FormFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  registration?: UseFormRegisterReturn;
  className?: string;
  autoComplete?: string;
};

export function FormField({
  label,
  type = "text",
  placeholder,
  error,
  registration,
  className,
  autoComplete,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="inline-block text-sm font-medium text-slate-500 mb-1">
        {label}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        {...registration}
        className="w-full text-xs md:text-sm h-12 border border-slate-200 rounded-lg bg-white px-3 outline-none focus:ring-1 focus:ring-blue-500"
        autoComplete={autoComplete}
      />
      {error && (
        <p className="mt-1 text-xs md:text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
