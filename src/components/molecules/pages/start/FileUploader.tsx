"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";
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
import { StartStep } from ".";

type FileUploaderProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  outOfTokens?: boolean;
};

export default function FileUploader({
  files,
  onFilesChange,
  disabled = false,
  outOfTokens = false,
}: FileUploaderProps) {
  const isLocked = disabled || outOfTokens;

  const onFileReject = React.useCallback(
    (file: File, message: string) => {
      // If locked, show upsell instead of generic reject reason
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

  // Guard value changes when locked
  const handleValueChange = React.useCallback(
    (next: File[]) => {
      if (isLocked) return;
      onFilesChange(next);
    },
    [isLocked, onFilesChange]
  );

  return (
    <StartStep
      step={1}
      title="Show us the issue"
      subtitle="A picture says a thousand words. It helps us find you the best pros."
      className="space-y-3"
    >
      <div className="relative">
        <FileUpload
          maxFiles={1}
          maxSize={5 * 1024 * 1024}
          className={`w-full ${isLocked ? "opacity-60" : ""}`}
          value={files}
          onValueChange={handleValueChange}
          onFileReject={onFileReject}
          disabled={isLocked}
        >
          <FileUploadDropzone className={isLocked ? "pointer-events-none" : ""}>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center justify-center rounded-full border border-muted-foreground p-2.5">
                <Upload className="size-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Drag & drop files here</p>
              <p className="text-muted-foreground text-xs">
                Or click to browse (max 1 file, up to 5MB)
              </p>
            </div>

            <FileUploadTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-fit"
                disabled={isLocked}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                  }
                }}
              >
                Browse files
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>

          <FileUploadList>
            {files.map((file, index) => (
              <FileUploadItem
                key={index}
                value={file}
                className="border-slate-200"
              >
                <FileUploadItemPreview className="border-slate-200" />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <button
                    className="w-7 h-7 bg-slate-200 flex justify-center items-center rounded cursor-pointer text-gray-600 hover:bg-slate-300 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLocked}
                    onClick={(e) => {
                      if (isLocked) {
                        e.preventDefault();
                        toast.error("Action disabled");
                      }
                    }}
                  >
                    <X size={18} />
                  </button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      </div>
    </StartStep>
  );
}
