"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
// import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Check, FileText, Package, CreditCard, RefreshCw, X, Calendar } from "lucide-react"
import { format } from "date-fns"

interface BookingDetailsProps {
  bookingId: string
}

// Booking status types
type BookingStatus = "confirmed" | "label_ready" | "shipped" | "return_due" | "returned"
type PickupStatus = "confirmed" | "scheduled" | "collected" | "return_due" | "returned"

interface BookingStepProps {
  icon: React.ReactNode
  title: string
  date: string
  isActive: boolean
  isCompleted: boolean
}

const BookingStep = ({ icon, title, date, isActive, isCompleted }: BookingStepProps) => (
  <div className="flex flex-col items-center">
    <div
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center",
        isCompleted || isActive ? "bg-[#8c1c3a] text-white" : "bg-gray-200 text-gray-400",
      )}
    >
      {icon}
    </div>
    <p className="mt-2 font-medium text-sm text-center">{title}</p>
    <p className="text-xs text-gray-500">{date}</p>
  </div>
)

export function BookingDetails({ bookingId }: BookingDetailsProps) {
  // const router = useRouter()
  const [bookingType,] = useState<"shipping" | "pickup">("shipping")

  const [status, setStatus] = useState<BookingStatus | PickupStatus>("confirmed")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showPickupModal, setShowPickupModal] = useState(false)
  const [pickupAction, setPickupAction] = useState<string | null>(null)
  const [showTryOnModal, setShowTryOnModal] = useState(false)

  // Simulated booking data
  const bookingData = {
    id: bookingId,
    customerId: "############",
    dressName: "Aje - Floral Midi Dress",
    rentalPeriod: "Apr 15, 2025 - Apr 18, 2025",
    totalPrice: "$50",
    rentalFee: "$40",
    fees: "$10",
    lenderPrice: "$0",
    orderDate: "Apr 10, 2025",
    status: "Confirmed",
    dress: {
      id: "MG-XXXXXX",
      brand: "XXXXXX",
      price: "$XX",
      image: "/woman-black-dress.png",
    },
  }

  // Simulated payment data
  const paymentData = {
    status: "Paid",
    method: "Credit Card (Visa ending 1234)",
    transactionId: "TXN-789012",
    fees: "$10",
    paidOn: "Apr 10, 2025",
  }

  // Simulated analytics data
  const analyticsData = {
    totalOrders: 12,
    customerOrderHistory: 3,
    averageRentalDuration: 4,
  }

  // Handle status change to see different timeline states
  useEffect(() => {
    try {
      // For demo purposes
      const statusMapping: Record<string, BookingStatus | PickupStatus> = {
        shipping: "label_ready",
        pickup: "scheduled",
      }

      if (bookingType in statusMapping) {
        setStatus(statusMapping[bookingType])
      }
    } catch (err) {
      console.error("Error setting status:", err)
    }
  }, [bookingType])

  const handleStatusAction = (action: string) => {
    try {
      if (action === "confirm_pickup") {
        setPickupAction("pickup")
        setShowPickupModal(true)
      } else if (action === "confirm_tryon") {
        setPickupAction("tryon")
        setShowPickupModal(true)
      } else if (action === "item_picked_up") {
        setStatus("return_due")
      } else if (action === "customer_tried_on") {
        setShowTryOnModal(true)
      } else if (action === "cancel") {
        setShowCancelModal(true)
      }
    } catch (err) {
      console.error("Error handling action:", err)
    }
  }

  // Shipping timeline steps
  const shippingSteps = [
    {
      icon: <Check className="h-6 w-6" />,
      title: "Order Confirmed",
      date: "April 12",
      isActive: status === "confirmed",
      isCompleted: ["confirmed", "label_ready", "shipped", "return_due", "returned"].includes(status as BookingStatus),
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Label Ready",
      date: "April 15",
      isActive: status === "label_ready",
      isCompleted: ["label_ready", "shipped", "return_due", "returned"].includes(status as BookingStatus),
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Dress Shipped",
      date: "April 15",
      isActive: status === "shipped",
      isCompleted: ["shipped", "return_due", "returned"].includes(status as BookingStatus),
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Return Due",
      date: "April 18",
      isActive: status === "return_due",
      isCompleted: ["return_due", "returned"].includes(status as BookingStatus),
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Dress Returned",
      date: "April ##",
      isActive: status === "returned",
      isCompleted: ["returned"].includes(status as BookingStatus),
    },
  ]

  // Pickup timeline steps
  const pickupSteps = [
    {
      icon: <Check className="h-6 w-6" />,
      title: "Order Confirmed",
      date: "April 12",
      isActive: status === "confirmed",
      isCompleted: ["confirmed", "scheduled", "collected", "return_due", "returned"].includes(status as PickupStatus),
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Pickup Scheduled",
      date: "April 15",
      isActive: status === "scheduled",
      isCompleted: ["scheduled", "collected", "return_due", "returned"].includes(status as PickupStatus),
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Dress Collected",
      date: "April 15",
      isActive: status === "collected",
      isCompleted: ["collected", "return_due", "returned"].includes(status as PickupStatus),
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Return Due",
      date: "April 18",
      isActive: status === "return_due",
      isCompleted: ["return_due", "returned"].includes(status as PickupStatus),
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Dress Returned",
      date: "April ##",
      isActive: status === "returned",
      isCompleted: ["returned"].includes(status as PickupStatus),
    },
  ]

  const steps = bookingType === "shipping" ? shippingSteps : pickupSteps

  // Action buttons based on status and booking type
  const renderActionButtons = () => {
    if (bookingType === "shipping") {
      if (status === "confirmed") {
        return (
          <button
            className="px-4 py-2 text-sm bg-[#8c1c3a] text-white rounded-md"
            onClick={() => handleStatusAction("fulfill")}
          >
            Fulfill Order
          </button>
        )
      } else if (status === "label_ready") {
        return (
          <button
            className="px-4 py-2 text-sm bg-white border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
            onClick={() => handleStatusAction("print_label")}
          >
            Print Shipping Label
          </button>
        )
      }
    } else if (bookingType === "pickup") {
      if (status === "scheduled") {
        return (
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-sm bg-white border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
              onClick={() => handleStatusAction("confirm_pickup")}
            >
              Confirm Pick Up time
            </button>
            <button
              className="px-4 py-2 text-sm bg-white border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
              onClick={() => handleStatusAction("confirm_tryon")}
            >
              Confirm Try-On Time
            </button>
          </div>
        )
      } else if (status === "collected") {
        return (
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-sm bg-white border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
              onClick={() => handleStatusAction("item_picked_up")}
            >
              Picked Up By Customer
            </button>
            <button
              className="px-4 py-2 text-sm bg-white border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
              onClick={() => handleStatusAction("customer_tried_on")}
            >
              Customer Tried On
            </button>
          </div>
        )
      }
    }

    if (status === "return_due") {
      return (
        <button
          className="px-4 py-2 text-sm bg-white border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
          onClick={() => handleStatusAction("mark_returned")}
        >
          Mark as Returned
        </button>
      )
    }

    return (
      <button
        className="px-4 py-2 text-sm bg-white border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
        onClick={() => handleStatusAction("escalate_dispute")}
      >
        Escalate Dispute
      </button>
    )
  }

  // Format date string for display
  // const formatDateString = (dateString: string) => {
  //   try {
  //     if (dateString === "April ##") return dateString
  //     const parts = dateString.split(" ")
  //     if (parts.length < 2) return dateString

  //     return `${parts[0]} ${parts[1]}`
  //   } catch {
  //     return dateString
  //   }
  // }

  return (
    <>
      <div className="p-8">
        <h2 className="text-2xl font-bold uppercase mb-8">BOOKING DETAILS</h2>

        {/* Timeline */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <BookingStep {...step} />

                {/* Divider line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-6 left-[calc(50%+24px)] h-[2px] w-[calc(100%-48px)]",
                      // Color the line if the next step is completed or active
                      steps[index + 1].isCompleted || steps[index + 1].isActive ? "bg-[#8c1c3a]" : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">{renderActionButtons()}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-[#d8f2ea] text-[#39a282] text-xs font-medium py-1 px-3 rounded">Confirmed</div>
            </div>

            <h3 className="text-lg font-medium mb-4">Booking ID: {bookingId}</h3>

            <div className="space-y-2 text-sm">
              <p>Customer ID: {bookingData.customerId}</p>
              <p>Dress: {bookingData.dressName}</p>
              <p>Rental Period: {bookingData.rentalPeriod}</p>
              <p>
                Price: {bookingData.lenderPrice} , Fees: {bookingData.fees}
              </p>
              <p>Order Date: {bookingData.orderDate}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>

            <div className="flex space-x-4">
              <div className="w-32 h-40 overflow-hidden">
                <Image
                  src={bookingData.dress.image || "/placeholder.svg"}
                  alt={bookingData.dressName}
                  width={128}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-lg font-medium">DRESS ID : {bookingData.dress.id}</p>
                <p>ID: {bookingData.dress.id}</p>
                <p>Brand: {bookingData.dress.brand}</p>
                <p>Price: {bookingData.dress.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Payment Details</h3>

            <div className="space-y-2 text-sm">
              <p>Status: {paymentData.status}</p>
              <p>Method: {paymentData.method}</p>
              <p>Transaction ID: {paymentData.transactionId}</p>
              <p>Dress Fees: {paymentData.fees}</p>
              <p>Paid On: {paymentData.paidOn}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Analytics Snapshot</h3>

            <div className="space-y-2 text-sm">
              <p>Total Orders for this Dress: {analyticsData.totalOrders}</p>
              <p>Customer Order History: {analyticsData.customerOrderHistory} orders</p>
              <p>Average Rental Duration: {analyticsData.averageRentalDuration} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <h3 className="text-lg font-medium mb-4">Having an issue with this booking?</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dispute Reason</label>
              <select className="w-full p-3 border rounded-md">
                <option>Damaged Dress</option>
                <option>Late Return</option>
                <option>Missing Items</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea className="w-full p-3 border rounded-md" rows={4} />
            </div>

            <div className="flex items-center justify-between">
              <div className="relative inline-block">
                <input type="text" className="border rounded-md py-2 px-3 w-64" placeholder="File name" readOnly />
                <button className="absolute right-0 top-0 bottom-0 px-3 bg-[#8c1c3a] text-white rounded-r-md">
                  Upload File
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Note: Disputes should only be submitted after the return due date or for urgent issues.
            </p>

            <button className="px-4 py-2 bg-[#8c1c3a] text-white text-sm rounded-md">Submit</button>
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          <button className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md">Download Invoice</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md" onClick={() => setShowCancelModal(true)}>
            Cancel Order
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-center mb-6">
              <div className="text-[#8c1c3a] text-4xl font-serif italic">𝓜</div>
            </div>

            <h2 className="text-2xl font-medium text-center mb-4">Are you sure you want to cancel this booking?</h2>

            <p className="text-center mb-8">
              Please confirm that the item was not provided to the customer. Once cancelled, the customer will be
              refunded full amount and this booking will be closed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-6 py-3 bg-[#8c1c3a] text-white rounded-md order-2 sm:order-1"
                onClick={() => setShowCancelModal(false)}
              >
                Confirm Cancellation
              </button>
              <button
                className="px-6 py-3 border border-gray-300 rounded-md order-1 sm:order-2"
                onClick={() => setShowCancelModal(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pickup Confirmation Modal - Chat Interface */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">
                {pickupAction === "pickup" ? "Confirm Pickup Time" : "Confirm Try-On Time"}
              </h3>
              <button onClick={() => setShowPickupModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm">
                {pickupAction === "pickup"
                  ? `Hi! This is to confirm your pickup appointment on ${format(new Date(), "MMMM dd, yyyy")} at 2:00 PM. Please let me know if this works for you!`
                  : `Hi! This is to confirm your try-on appointment on ${format(new Date(), "MMMM dd, yyyy")} at 2:00 PM. Please arrive on time so we can ensure you have the best experience!`}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md"
                onClick={() => {
                  setShowPickupModal(false)
                  if (bookingType === "pickup" && status === "scheduled") {
                    setStatus("collected")
                  }
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Try-On Flow Modal */}
      {showTryOnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Try-On Outcome</h3>
              <button onClick={() => setShowTryOnModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">Please select what happened during the try-on:</p>

              <div className="space-y-2">
                <button
                  className="w-full p-3 text-left border rounded-md hover:bg-gray-50"
                  onClick={() => {
                    setShowTryOnModal(false)
                    setStatus("return_due")
                  }}
                >
                  Customer picked up item as booked
                </button>

                <button
                  className="w-full p-3 text-left border rounded-md hover:bg-gray-50"
                  onClick={() => setShowTryOnModal(false)}
                >
                  Customer did not proceed (partial refund)
                </button>

                <button
                  className="w-full p-3 text-left border rounded-md hover:bg-gray-50"
                  onClick={() => setShowTryOnModal(false)}
                >
                  Customer selected different item
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Note: Selecting an option will update the booking status and may trigger payment changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
