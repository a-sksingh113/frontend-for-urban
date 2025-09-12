"use client";
import * as React from "react";
import { Button } from "@/components/atoms";
import { ButtonWithLoading } from "@/components/molecules/global/reusable-ui";

type Props = {
  isLoading: boolean;
  onCancel: () => void;
};

export function EditProfileActions({ isLoading, onCancel }: Props) {
  return (
    <div className="flex gap-3">
      <ButtonWithLoading
        size="md"
        isLoading={isLoading}
        loadingText="Updating..."
      >
        Save Changes
      </ButtonWithLoading>
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
    </div>
  );
}
