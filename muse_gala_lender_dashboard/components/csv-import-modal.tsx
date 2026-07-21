/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, AlertCircle, Check } from "lucide-react"
import { parseCSV } from "@/utils/csv-utils"
import { CSVTemplateButton } from "./csv-template-button"

interface CSVImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: any[]) => void
}

export function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)

    if (!selectedFile) {
      return
    }

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      setFile(null)
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string
        const parsedData = parseCSV(csvContent)

        setCsvData(parsedData)
        setPreviewData(parsedData.slice(0, 3)) // Show just first 3 rows in preview

        if (parsedData.length === 0) {
          setError("CSV file appears to be empty")
        }
      } catch (err) {
        setError("Error parsing CSV file. Please check the format.")
        console.error(err)
      }
    }

    reader.readAsText(selectedFile)
  }

  const handleImport = () => {
    if (!csvData.length) {
      setError("No data to import")
      return
    }

    setIsLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      onImport(csvData)
      setIsLoading(false)
      onClose()
    }, 1000)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const droppedFile = e.dataTransfer.files[0]
    if (!droppedFile) return

    if (droppedFile.type !== "text/csv" && !droppedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setFile(droppedFile)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string
        const parsedData = parseCSV(csvContent)

        setCsvData(parsedData)
        setPreviewData(parsedData.slice(0, 3))

        if (parsedData.length === 0) {
          setError("CSV file appears to be empty")
        }
      } catch (err) {
        setError("Error parsing CSV file. Please check the format.")
        console.error(err)
      }
    }

    reader.readAsText(droppedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Import Dress Listings from CSV</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!file ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
              <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-2">Drop your CSV file here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032]"
                >
                  Select File
                </button>
                <CSVTemplateButton />
              </div>

              {error && (
                <div className="mt-4 flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium text-sm mb-2">CSV Format Requirements:</h3>
                <ul className="text-xs text-gray-600 text-left list-disc pl-5 space-y-1">
                  <li>First row must contain headers</li>
                  <li>
                    Required columns: Dress Name, Brand, Size, Color, Condition, Category, Description, Materials, Care
                    Instructions, Rental Price (4 days)
                  </li>
                  <li>Optional columns: Pickup Address, Rental Price (8 days)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-md">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setCsvData([])
                    setPreviewData([])
                    setError(null)
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error ? (
                <div className="mb-4 flex items-center text-red-500 text-sm p-3 bg-red-50 rounded-md">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              ) : (
                <div className="mb-4 flex items-center text-green-500 text-sm p-3 bg-green-50 rounded-md">
                  <Check className="h-5 w-5 mr-2" />
                  Successfully parsed {csvData.length} records
                </div>
              )}

              {previewData.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Preview (First 3 records):</h3>
                  <div className="border rounded-md overflow-auto max-h-64">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(previewData[0]).map((header) => (
                            <th
                              key={header}
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex} className="px-3 py-2 text-xs text-gray-500 truncate max-w-xs">
                                {value as string}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032]"
            disabled={!csvData.length || isLoading}
          >
            {isLoading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  )
}
