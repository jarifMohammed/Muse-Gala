"use client"

import { Download } from "lucide-react"
import { generateCSVTemplate, downloadCSV } from "@/utils/csv-utils"

export function CSVTemplateButton() {
  const handleDownload = () => {
    const csvContent = generateCSVTemplate()
    downloadCSV("dress-listings-template.csv", csvContent)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
    >
      <Download className="h-4 w-4 mr-1" /> Download CSV Template
    </button>
  )
}
