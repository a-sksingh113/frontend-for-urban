"use client";

import * as React from "react";
import { X, User as UserIcon, ImageUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/atoms";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/molecules/global/file-uploader/Uploader";

type Props = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  outOfTokens?: boolean;
  /** Optional: pass the user’s current photo URL so we can show an avatar + “Change” state */
  currentUrl?: string | null;
};

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
const ACCEPT = "image/png,image/jpeg";

function prettyMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function UserProfileUploader({
  files,
  onFilesChange,
  disabled = false,
  outOfTokens = false,
  currentUrl = null,
}: Props) {
  const isLocked = disabled || outOfTokens;
  const selected = files?.[0] ?? null;

  const onFileReject = React.useCallback(
    (file: File, message: string) => {
      if (isLocked) {
        toast.error("Uploads are disabled", {
          description: "You’re out of credits. Please buy tokens or upgrade.",
        });
        return;
      }
      toast(message, {
        description: `"${
          file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        }" has been rejected`,
      });
    },
    [isLocked]
  );

  const handleValueChange = React.useCallback(
    (next: File[]) => {
      if (isLocked) return;

      const accepted = next.filter(
        (f) =>
          f.size <= MAX_SIZE_BYTES &&
          (f.type === "image/png" || f.type === "image/jpeg")
      );

      if (accepted.length !== next.length) {
        toast.error(
          `Only PNG/JPEG up to ${prettyMB(MAX_SIZE_BYTES)} are allowed`
        );
      }

      onFilesChange(accepted.slice(0, 1));
    },
    [isLocked, onFilesChange]
  );

  const clear = React.useCallback(() => onFilesChange([]), [onFilesChange]);

  // If there is already a photo (existing url or selected file), render a compact, “professional” row:
  const hasPreview = Boolean(selected || currentUrl);

  return (
    <div className="space-y-3">
      {/* Label + helper */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500">
            Upload a square photo for best results (PNG/JPEG, max 1MB).
          </div>

          {hasPreview ? (
            <div className="mt-2 flex items-center gap-2">
              <FileUpload
                maxFiles={1}
                maxSize={MAX_SIZE_BYTES}
                accept={ACCEPT}
                value={files}
                onValueChange={handleValueChange}
                onFileReject={onFileReject}
                disabled={isLocked}
                className="contents"
              ></FileUpload>

              {selected ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clear}
                  disabled={isLocked}
                  className="gap-1 text-slate-600 hover:text-slate-900"
                  aria-label="Remove selected photo"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* If no photo yet, show a clean, professional dropzone */}
      {!hasPreview && (
        <div className="relative">
          <FileUpload
            maxFiles={1}
            maxSize={MAX_SIZE_BYTES}
            accept={ACCEPT}
            className={`w-full ${isLocked ? "opacity-60" : ""}`}
            value={files}
            onValueChange={handleValueChange}
            onFileReject={onFileReject}
            disabled={isLocked}
          >
            <FileUploadDropzone
              className={[
                "rounded-xl border border-dashed border-slate-300",
                "hover:border-slate-400 focus-within:border-slate-400",
                "bg-slate-50/40",
                "transition-colors",
                isLocked ? "pointer-events-none" : "",
              ].join(" ")}
              aria-label="Upload profile photo"
            >
              <div className="flex flex-col items-center gap-2 text-center py-8">
                <div className="flex items-center justify-center rounded-full border border-slate-300 p-2.5">
                  <ImageUp className="w-6 h-6 text-slate-500" />
                </div>
                <p className="font-medium text-sm text-slate-800">
                  Drag &amp; drop your photo
                </p>
                <p className="text-slate-500 text-xs">
                  Or click to browse (PNG/JPEG, up to {prettyMB(MAX_SIZE_BYTES)}
                  )
                </p>

                <FileUploadTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    disabled={isLocked}
                    onClick={(e) => {
                      if (isLocked) e.preventDefault();
                    }}
                    aria-label="Choose profile photo"
                  >
                    Choose photo
                  </Button>
                </FileUploadTrigger>
              </div>
            </FileUploadDropzone>

            {/* Keep list hidden visually; we manage preview above.
                Still useful for accessibility / metadata. */}
            <FileUploadList className="sr-only">
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <button aria-label="Remove file">
                      <X />
                    </button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </div>
      )}
    </div>
  );
}
