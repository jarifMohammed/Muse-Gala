"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileImage } from "lucide-react"

interface DragDropFileUploadProps {
  onFilesSelected: (files: File[]) => void
  multiple?: boolean
  accept?: string
  maxFiles?: number
  maxSizeInMB?: number
  className?: string
}

export function DragDropFileUpload({
  onFilesSelected,
  multiple = true,
  accept = "image/*",
  maxFiles = 10,
  maxSizeInMB = 5,
  className = "",
}: DragDropFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const validateFiles = (files: File[]): File[] => {
    setError(null)

    // Check number of files
    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once`)
      return []
    }

    // Filter files by size and type
    const validFiles = files.filter((file) => {
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeInMB}MB`)
        return false
      }

      // Check file type
      if (accept !== "*" && !file.type.match(accept.replace("*", ".*"))) {
        setError(`Only ${accept.replace("*/", "")} files are allowed`)
        return false
      }

      return true
    })

    if (validFiles.length < files.length) {
      setError("Some files were not included due to size or format restrictions")
    }

    return validFiles
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const dt = e.dataTransfer
    const files = Array.from(dt.files)

    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const files = Array.from(e.target.files)
    const validFiles = validateFiles(files)

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`${className}`}>
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
          isDragging ? "border-[#891d33] bg-[#891d33]/5" : "border-gray-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          multiple={multiple}
          accept={accept}
        />

        <FileImage className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 mb-2">{isDragging ? "Drop files here" : "Drag and drop your files here"}</p>
        <p className="text-gray-400 text-sm mb-3">or</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032]"
        >
          Browse Files
        </button>

        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

        <p className="mt-3 text-xs text-gray-500">
          Up to {maxFiles} files, {maxSizeInMB}MB max per file
        </p>
      </div>
    </div>
  )
}
