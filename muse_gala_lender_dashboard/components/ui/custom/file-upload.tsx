"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { CloudUpload, Upload, X } from "lucide-react";
import Image from "next/image"; // <-- use Next.js Image
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadedFile {
  id: string;
  file: File | null;
  name: string;
  type: "image" | "video";
  url: string;
  progress: number;
  uploading: boolean;
  preview?: string;
}

interface FileUploaderProps {
  values?: string[];
  onChange: (urls: string[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  id?: string;
}

export function FileUploader({
  values = [],
  onChange,
  onUploadStateChange,
  id,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { edgestore } = useEdgeStore();
  const previewUrlsRef = useRef(new Set<string>());

  // Notify parent when any upload is in progress
  useEffect(() => {
    onUploadStateChange?.(files.some((f) => f.uploading));
  }, [files, onUploadStateChange]);

  // Merge incoming `values` (URLs) with any local/uploading files
  useEffect(() => {
    setFiles((prev) => {
      const uploadingOrLocal = prev.filter(
        (f) => f.file !== null || f.uploading
      );
      const existingUrlEntries = prev.filter(
        (f) => f.url && values.includes(f.url)
      );

      const existingUrls = new Set(existingUrlEntries.map((f) => f.url));
      const newUrlFiles = (values || [])
        .filter((url) => !existingUrls.has(url))
        .map((url) => {
          const name = url.split("/").pop() || url;
          const type = url.toLowerCase().endsWith(".mp4") ? "video" : "image";
          return {
            id: `url-${url}`,
            file: null,
            name,
            type,
            url,
            progress: 100,
            uploading: false,
          } as UploadedFile;
        });

      return [...uploadingOrLocal, ...existingUrlEntries, ...newUrlFiles];
    });
  }, [values]);

  const handleUpload = useCallback(
    async (selectedFile: File) => {
      const id =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof crypto !== "undefined" && (crypto as any).randomUUID
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (crypto as any).randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const preview = URL.createObjectURL(selectedFile);
      previewUrlsRef.current.add(preview);

      const tempFile: UploadedFile = {
        id,
        file: selectedFile,
        name: selectedFile.name,
        type: selectedFile.type.startsWith("video") ? "video" : "image",
        url: "",
        progress: 0,
        uploading: true,
        preview,
      };

      setFiles((prev) => [...prev, tempFile]);

      try {
        const res = await edgestore.publicFiles.upload({
          file: selectedFile,
          onProgressChange: (progress) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === id ? { ...f, progress, uploading: progress < 100 } : f
              )
            );
          },
        });

        setFiles((prev) => {
          const updated = prev.map((f) => {
            if (f.id === id) {
              if (f.preview) {
                try {
                  URL.revokeObjectURL(f.preview);
                } catch {}
                previewUrlsRef.current.delete(f.preview);
              }

              return {
                ...f,
                url: res.url,
                uploading: false,
                progress: 100,
                file: null,
                preview: undefined,
              };
            }
            return f;
          });

          const urls = updated.map((f) => f.url).filter(Boolean);
          onChange(urls);

          return updated;
        });
      } catch (err) {
        console.error("Upload failed", err);
        setFiles((prev) => {
          const toRemove = prev.find((f) => f.id === id);
          if (toRemove?.preview) {
            try {
              URL.revokeObjectURL(toRemove.preview);
            } catch {}
            previewUrlsRef.current.delete(toRemove.preview);
          }
          return prev.filter((f) => f.id !== id);
        });
      }
    },
    [edgestore, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => handleUpload(file));
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "video/mp4": [],
    },
  });

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const toRemove = prev.find((f) => f.id === id);
        if (toRemove?.preview) {
          try {
            URL.revokeObjectURL(toRemove.preview);
          } catch {}
          previewUrlsRef.current.delete(toRemove.preview);
        }
        const updated = prev.filter((f) => f.id !== id);
        onChange(updated.map((f) => f.url).filter(Boolean));
        return updated;
      });
    },
    [onChange]
  );

  useEffect(() => {
    // Copy the current previews into a local array and clear the ref immediately
    const previews = Array.from(previewUrlsRef.current);
    previewUrlsRef.current.clear();

    return () => {
      previews.forEach((p) => {
        try {
          URL.revokeObjectURL(p);
        } catch {}
      });
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 w-full rounded-md border border-dashed border-input bg-background px-3 py-6 md:py-10 text-sm ring-offset-background transition-colors cursor-pointer",
          isDragActive ? "border-primary bg-primary/10" : "",
          files.some((f) => f.uploading) && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} id={id ?? "File-Upload"} />
        <div className="flex flex-col items-center text-muted-foreground gap-1">
          {isDragActive ? (
            <Upload className="h-8 w-8" />
          ) : (
            <CloudUpload className="h-8 w-8" />
          )}
          <p className="text-xs">
            {isDragActive ? "Drop files here" : "Drag & drop or click"}
          </p>
        </div>
      </div>

      {/* File Previews */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((f) => (
          <div
            key={f.id}
            className="relative flex flex-col items-center gap-2 border rounded-md p-2 shadow-sm bg-muted/10"
          >
            {f.type === "video" ? (
              <video
                src={f.url || f.preview}
                controls
                className="rounded-md max-h-32"
              />
            ) : (
              <Image
                src={f.url || f.preview!}
                alt={f.name}
                width={120}
                height={120}
                className="rounded-md object-contain max-h-32"
              />
            )}

            <span className="text-xs truncate max-w-[100px]">{f.name}</span>

            {f.uploading && (
              <div className="w-full h-1 bg-gray-200 rounded">
                <div
                  className="h-full bg-primary rounded"
                  style={{ width: `${f.progress}%` }}
                />
              </div>
            )}

            <button
              onClick={() => removeFile(f.id)}
              className="absolute top-1 right-1 rounded-full bg-white shadow p-1 text-red-500 hover:bg-red-100"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
