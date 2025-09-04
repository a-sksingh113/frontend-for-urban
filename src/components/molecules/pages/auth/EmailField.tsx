/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Input } from "@/components/atoms";

type Props = {
  error?: string;
  id?: string;
  register: any;
};

export function EmailField({ register, error, id = "email" }: Props) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="inline-block text-sm font-medium text-slate-700"
      >
        Email
      </label>
      <Input
        id={id}
        type="email"
        placeholder="Enter your email address"
        autoComplete="email"
        className="w-full h-12 border border-slate-200 rounded-lg bg-white px-3 outline-none focus:ring-1 focus:ring-blue-500"
        {...register("email")}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
