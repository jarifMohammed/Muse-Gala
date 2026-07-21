/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
// import { CancelOrderModal } from "./ui/cancel-order-modal"

interface Dress {
  id: string
  name?: string
  brand: string
  price: string
  image: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (bookingData: any) => void
  dresses: Dress[]
  initialStartDate?: string
  initialEndDate?: string
}

export function BookingModal({
  isOpen,
  onClose,
  onSave,
  dresses,
  initialStartDate,
  initialEndDate,
}: BookingModalProps) {
  const [selectedDressId, setSelectedDressId] = useState<string | null>(null)
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [status, setStatus] = useState<string>("Make as Booked")
  const [description, setDescription] = useState<string>("")
  const [showDressDetails, setShowDressDetails] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [customerName, setCustomerName] = useState<string>("")
  const [customerEmail, setCustomerEmail] = useState<string>("")
  const [customerPhone, setCustomerPhone] = useState<string>("")

  useEffect(() => {
    try {
      if (selectedDressId) {
        const dress = dresses.find((d) => d.id === selectedDressId)
        if (dress) {
          setSelectedDress(dress)
          setShowDressDetails(true)
        } else {
          setSelectedDress(null)
          setShowDressDetails(false)
        }
      } else {
        setSelectedDress(null)
        setShowDressDetails(false)
      }
    } catch (err) {
      console.error("Error selecting dress:", err)
      setSelectedDress(null)
      setShowDressDetails(false)
    }
  }, [selectedDressId, dresses])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDressId(null)
      setStartDate(initialStartDate || "")
      setEndDate(initialEndDate || "")
      setStatus("Make as Booked")
      setDescription("")
      setCustomerName("")
      setCustomerEmail("")
      setCustomerPhone("")
      setErrors({})
    }
  }, [isOpen, initialStartDate, initialEndDate])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!selectedDressId) {
      newErrors.dress = "Please select a dress"
    }

    if (!startDate) {
      newErrors.startDate = "Please select a start date"
    }

    if (!endDate) {
      newErrors.endDate = "Please select an end date"
    } else if (startDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    if (!customerName) {
      newErrors.customerName = "Please enter customer name"
    }

    if (!status) {
      newErrors.status = "Please select a status"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    try {
      if (!validateForm()) {
        return
      }

      onSave({
        dressId: selectedDressId,
        startDate,
        endDate,
        status,
        description,
        customerName,
        customerEmail,
        customerPhone,
      })

      // Reset the form
      setSelectedDressId(null)
      setStartDate("")
      setEndDate("")
      setStatus("Make as Booked")
      setDescription("")
      setCustomerName("")
      setCustomerEmail("")
      setCustomerPhone("")

      onClose()
    } catch (err) {
      console.error("Error submitting booking:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="font-avenirNormal fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1118px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-[60px] pt-[60px]">
          <h2 className="font-avenirNormal text-[32px] font-normal leading-[120%] tracking-[0%] text-black">
            Manual Booking
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-[60px] space-y-[30px]">
          <div>
            <label className="font-avenirNormal block pb-[25px] text-[24px] font-normal leading-[120%] text-black tracking-[0%]">
              Select Dress <span className="text-[#891D33] pl-5">*</span>
            </label>
            <div className="relative w-[306px]">
              <select
                value={selectedDressId || ""}
                onChange={(e) => setSelectedDressId(e.target.value)}
                className={cn(
                  "font-avenirNormal w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a] appearance-none",
                  errors?.dress ? "border-red-500" : "border-[#8c1c3a]",
                )}
                required
              >
                <option value="">Select One</option>
                {dresses.map((dress) => (
                  <option key={dress.id} value={dress.id}>
                    {dress.name || dress.id} - {dress.brand}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-[#8c1c3a]" />
              </div>
              {errors?.dress && <p className="text-red-500 text-xs mt-1">{errors.dress}</p>}
            </div>
          </div>

          {showDressDetails && selectedDress && (
            <div className="bg-[#FEFAF6] rounded-r-[8px]">
              <div className="flex gap-[15px]">
                <div className="">
                  <Image
                    src={selectedDress.image || "/placeholder.svg"}
                    alt={selectedDress.name || selectedDress.id}
                    width={150}
                    height={193}
                    className="object-cover w-[150px] h-[193px] rounded-l-[8px]"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-2xl font-normal leading-[120%] text-black tracking-[0%] font-avenirNormal uppercase">
                    {selectedDress.name || `DRESS ID: ${selectedDress.id}`}
                  </p>
                  <p className="text-lg font-normal leading-[120%] text-black tracking-[20%] font-avenirNormal pt-[21px]">
                    Brand: {selectedDress.brand}
                  </p>
                  <p className="text-lg font-normal leading-[120%] text-black tracking-[20%] font-avenirNormal pt-4">
                    Price: {selectedDress.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[142px]">
            <div className="md:col-span-2">
              <label className="font-avenirNormal block text-[24px] font-normal leading-[120%] text-black tracking-[0%] pb-[25px]">
                Date Range <span className="text-[#8c1c3a]">*</span>
              </label>
              <div className="flex items-center gap-[20px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={cn(
                    "font-avenirNormal w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a]",
                    errors.startDate && "border-red-500",
                  )}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <span className="mx-2 text-[#8c1c3a]">—</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={cn(
                    "font-avenirNormal w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a]",
                    errors.endDate && "border-red-500",
                  )}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              {(errors.startDate || errors.endDate) && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate || errors.endDate}</p>
              )}
            </div>

            <div>
              <label className="font-avenirNormal block text-[24px] font-normal leading-[120%] text-black tracking-[0%] pb-[25px]">
                Status <span className="text-[#8c1c3a]">*</span>
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="font-avenirNormal w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a] appearance-none"
                >
                  <option value="Make as Booked">Make as Booked</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-[#8c1c3a]" />
                </div>
              </div>
            </div>

          </div>

          {/* <div>
            <label className="block mb-2 text-sm font-medium">
              Customer Name <span className="text-[#8c1c3a]">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={cn(
                "w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a]",
                errors.customerName && "border-red-500"
              )}
              placeholder="Enter customer name"
              required
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Customer Email <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a]"
                placeholder="customer@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Customer Phone <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a]"
                placeholder="(123) 456-7890"
              />
            </div>
          </div> */}

          <div>
            <label className="font-avenirNormal block text-[24px] font-normal leading-[120%] text-black tracking-[0%] pb-[25px]">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="font-avenirNormal w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#8c1c3a]"
              placeholder="Add any special notes or requirements for this booking..."
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center pb-[60px]">
          <button
            onClick={handleSubmit}
            className="font-avenirNormal text-base text-white font-normal bg-[#891D33] leading-[120%] tracking-[0%] py-[16px] px-[32px] rounded-[8px] "
          >
            Sync to calendar
          </button>
          <p className="text-lg font-normal text-black leading-[24px] tracking-[0%] font-avenirNormal pt-[15px]">
            Last since: 2h ago{" "}
          </p>
        </div>
      </div>
    </div>
  )
}
