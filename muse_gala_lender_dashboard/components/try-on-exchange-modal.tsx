/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface TryOnExchangeModalProps {
  isOpen: boolean
  onClose: () => void
  onAction: (action: string, data?: any) => void
}

export function TryOnExchangeModal({ isOpen, onClose, onAction }: TryOnExchangeModalProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [exchangeData, setExchangeData] = useState({
    newDressValue: "",
    originalValue: "50.00",
  })
  console.log(selectedAction)

  const [step, setStep] = useState(1)

  if (!isOpen) return null

  const handleSelectAction = (action: string) => {
    setSelectedAction(action)

    if (action === "item_picked_up") {
      onAction("item_picked_up")
      onClose()
    } else if (action === "not_collected") {
      // Will trigger refund flow
      setStep(2)
    } else if (action === "exchanged") {
      // Will trigger exchange flow
      setStep(3)
    }
  }

  // const handleExchangeConfirm = () => {
  //   // Will trigger exchange flow
  //   setStep(3)
  // }

  const handleExchangeConfirmFinal = () => {
    const newDressValue = Number.parseFloat(exchangeData.newDressValue)
    const originalValue = Number.parseFloat(exchangeData.originalValue)

    if (newDressValue > originalValue) {
      // Customer needs to pay more
      setStep(4)
    } else if (newDressValue < originalValue) {
      // Customer gets a refund
      onAction("exchange_refund", {
        originalValue,
        newDressValue,
        refundAmount: originalValue - newDressValue,
      })
      onClose()
    } else {
      // Same value, no additional actions needed
      onAction("exchange_equal")
      onClose()
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium">Please select what happened during the try-on:</p>

            <div className="space-y-2">
              <button
                className="w-full p-3 text-left border rounded-md hover:bg-gray-50"
                onClick={() => handleSelectAction("item_picked_up")}
              >
                Customer picked up item as booked
              </button>

              <button
                className="w-full p-3 text-left border rounded-md hover:bg-gray-50"
                onClick={() => handleSelectAction("not_collected")}
              >
                No item was collected (partial refund)
              </button>

              <button
                className="w-full p-3 text-left border rounded-md hover:bg-gray-50"
                onClick={() => handleSelectAction("exchanged")}
              >
                Another item was exchanged
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm">
                Customer will receive a partial refund (rental fee minus $10 non-refundable booking fee). The booking
                will be marked as completed externally.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md text-sm"
                onClick={() => {
                  onAction("no_collection_refund")
                  onClose()
                }}
              >
                Confirm & Process Refund
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium">Enter the value of the new dress:</p>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Original Dress Value</label>
              <input
                type="text"
                value={`$${exchangeData.originalValue}`}
                disabled
                className="w-full p-2 border rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">New Dress Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <input
                  type="number"
                  value={exchangeData.newDressValue}
                  onChange={(e) => setExchangeData({ ...exchangeData, newDressValue: e.target.value })}
                  className="w-full p-2 pl-8 border rounded-md"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md text-sm"
                onClick={handleExchangeConfirmFinal}
                disabled={!exchangeData.newDressValue}
              >
                Continue
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm">
                The new dress costs more than the original. The customer needs to pay an additional $
                {(
                  Number.parseFloat(exchangeData.newDressValue) - Number.parseFloat(exchangeData.originalValue)
                ).toFixed(2)}
                .
              </p>
              <p className="text-sm mt-2">
                A payment request will be sent to the customer. The booking will be updated once payment is received.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm" onClick={() => setStep(3)}>
                Back
              </button>
              <button
                className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md text-sm"
                onClick={() => {
                  onAction("exchange_additional_payment", {
                    originalValue: Number.parseFloat(exchangeData.originalValue),
                    newDressValue: Number.parseFloat(exchangeData.newDressValue),
                    additionalAmount:
                      Number.parseFloat(exchangeData.newDressValue) - Number.parseFloat(exchangeData.originalValue),
                  })
                  onClose()
                }}
              >
                Request Additional Payment
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Try-On Outcome</h3>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {renderStepContent()}
      </div>
    </div>
  )
}
