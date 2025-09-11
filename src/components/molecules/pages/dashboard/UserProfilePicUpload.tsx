"use client";

import * as React from "react";
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
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/atoms";

type UserProfilePicUploaderProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
};

const UserProfilePicUpload: React.FC<UserProfilePicUploaderProps> = ({
  files,
  onFilesChange,
}) => {
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  const handleValueChange = React.useCallback(
    (next: File[]) => {
      onFilesChange(next);
    },
    [onFilesChange]
  );

  return (
    <div className="relative">
      <label className="inline-block text-sm font-medium text-slate-500 mb-1">
        Upload Profile Photo
      </label>
      <FileUpload
        maxFiles={1}
        maxSize={1 * 1024 * 1024} // 1MB for profile pics
        accept="image/png,image/jpeg"
        className="w-full"
        value={files}
        onValueChange={handleValueChange}
        onFileReject={onFileReject}
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border border-muted-foreground p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop files here</p>
            <p className="text-muted-foreground text-xs">
              Or click to browse (max 1 file, up to 1MB)
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
    </div>
  );
};

export default UserProfilePicUpload;
