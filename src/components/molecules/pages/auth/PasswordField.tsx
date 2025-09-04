/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Input } from "@/components/atoms";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  error?: string;
  id?: string;
  register: any;
};

export function PasswordField({ register, error, id = "password" }: Props) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="inline-block text-sm font-medium text-slate-700"
      >
        Password
      </label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          className="w-full h-12 border border-slate-200 rounded-lg bg-white px-3 outline-none focus:ring-1 focus:ring-blue-500"
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-2 grid place-items-center rounded-md px-1 text-slate-500 hover:text-slate-700 cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
