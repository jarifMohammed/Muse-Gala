/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { UploadIcon as FileUpload } from "lucide-react"
import { CSVImportModal } from "./csv-import-modal"

interface BulkImportButtonProps {
  onImport: (data: any[]) => void
  buttonText?: string
}

export function BulkImportButton({ onImport, buttonText = "Import from CSV" }: BulkImportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032]"
      >
        <FileUpload className="h-4 w-4 mr-2" />
        {buttonText}
      </button>

      <CSVImportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onImport={onImport} />
    </>
  )
}
