"use client"

import { X } from "lucide-react"

interface CancellationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function CancellationModal({ isOpen, onClose, onConfirm }: CancellationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="text-[#8c1c3a] text-4xl font-serif italic">𝓜</div>
        </div>

        <h2 className="text-2xl font-medium text-center mb-4">Are you sure you want to cancel this booking?</h2>

        <p className="text-center mb-8">
          Please confirm that the item was not provided to the customer. Once cancelled, the customer will be refunded
          full amount and this booking will be closed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-[#8c1c3a] text-white rounded-md" onClick={onConfirm}>
            Confirm Cancellation
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-md" onClick={onClose}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
