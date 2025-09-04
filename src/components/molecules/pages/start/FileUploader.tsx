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
};

export default function FileUploader({
  files,
  onFilesChange,
}: FileUploaderProps) {
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <StartStep
      step={1}
      title="Show us the issue"
      subtitle="A picture says a thousand words. It helps us find you the best pros."
      className="space-y-3"
    >
      <FileUpload
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
        className="w-full"
        value={files}
        onValueChange={onFilesChange}
        onFileReject={onFileReject}
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border border-muted-foreground p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop files here</p>
            <p className="text-muted-foreground text-xs">
              Or click to browse (max 2 files, up to 5MB each)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button size="sm" variant="outline" className="mt-2 w-fit">
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
                <button className="w-7 h-7 bg-slate-200 flex justify-center items-center rounded cursor-pointer text-gray-600 hover:bg-slate-300 transition duration-150">
                  <X size={18} />
                </button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    </StartStep>
  );
}
