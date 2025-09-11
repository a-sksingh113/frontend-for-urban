"use client";

import React from "react";
import Button, { type Props as ButtonProps } from "@/components/atoms/Button";
import Spinner from "@/components/atoms/Spinner";

type ButtonWithLoadingProps = ButtonProps & {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
};

export default function ButtonWithLoading({
  isLoading = false,
  loadingText,
  children,
  disabled,
  ...rest
}: ButtonWithLoadingProps) {
  return (
    <Button disabled={isLoading || disabled} {...rest} type="submit">
      {isLoading ? (
        <span className="inline-flex items-center gap-2.5">
          <Spinner
            className="h-6 w-6 text-gray-50"
            trackClassName="text-white"
          />
          {loadingText ?? children}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
