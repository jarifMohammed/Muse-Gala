"use client";

import { type ChangeEvent, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileChange: (files: File[]) => void;
  className?: string;
  buttonText?: string;
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  files?: File[];
}

export function FileUpload({
  onFileChange,
  className,
  buttonText = "Upload File",
  placeholder = "File name",
  accept = "image/*,.pdf,.doc,.docx",
  multiple = false,
  files = [],
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(files);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = multiple
        ? [...selectedFiles, ...newFiles]
        : newFiles;
      setSelectedFiles(updatedFiles);
      onFileChange(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onFileChange(updatedFiles);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center border p-[10px] border-gray-300 rounded-md overflow-hidden">
        <div className="flex-grow px-3 py-2 text-sm text-gray-500">
          {selectedFiles.length > 0
            ? selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="truncate " >{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </button>
                </div>
              ))
            : placeholder}
        </div>
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-[#8c1c3a] text-white rounded-lg text-[16px] font-normal px-4 py-2 text-sm "
        >
          {buttonText}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            multiple={multiple}
          />
        </label>
      </div>
    </div>
  );
}
