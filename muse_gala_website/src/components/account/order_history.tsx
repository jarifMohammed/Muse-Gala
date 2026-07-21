/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MessageCircle, Loader2 } from 'lucide-react'

// Types
interface Order {
  _id: string
  dressName: string
  rentalStartDate: string
  rentalEndDate: string
  totalAmount: number
  deliveryStatus: string
  paymentStatus: string
  createdAt: string
  chatRoom: string | null
  deliveryMethod?: string
  shippingMethod?: string
  trackingNumber?: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalData: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const OrderHistory = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // Fetch Orders
  const { data, isLoading, isFetching } = useQuery({

    queryKey: ['customer-bookings', page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/all?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        },
      )
      return res.json()
    },
    enabled: !!session?.user?.accessToken,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  const orders: Order[] = data?.data?.bookings || []
  const pagination: PaginationInfo | null = data?.data?.paginationInfo || null

  // Handle Cancel Booking
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/${bookingId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        },
      )
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.message || 'Failed to cancel booking')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Booking cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel booking')
    },
  })

  const handleCancelBooking = (id: string) => {
    cancelBookingMutation.mutate(id)
  }

  // Handle Chat with Lender
  const handleChat = async (order: Order) => {
    // If chatRoom exists, navigate immediately without setting loading state
    if (order.chatRoom) {
      router.push(`/account/chats?id=${order.chatRoom}`)
      return
    }

    setLoadingChatId(order._id)
    // Create chatRoom
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/chatrooms/create-for-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({ bookingId: order._id }),
        },
      )

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to create chat room')

      toast.success('Chat room created successfully')
      const roomId = typeof json.data === 'string' ? json.data : json.data?._id
      if (roomId) {
        router.push(`/account/chats?id=${roomId}`)
      } else {
        router.push('/account/chats')
      }
    } catch (error) {
      toast.error('Failed to create chat room')
      console.error(error)
      setLoadingChatId(null)
    }
  }


  return (
    <div className="w-full">
      <section>
        {/* Header */}
        <OrderHeader />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader />
            <tbody>
              {isLoading && <LoadingRow />}
              {!isLoading && orders.length === 0 && <EmptyRow />}
              {orders.map(order => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onChat={handleChat}
                  isChatLoading={loadingChatId === order._id}
                  onCancelBooking={handleCancelBooking}
                  isCancelling={
                    cancelBookingMutation.isPending &&
                    cancelBookingMutation.variables === order._id
                  }
                />

              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && orders.length > 0 && (
          <Pagination
            pagination={pagination}
            currentPage={page}
            onPageChange={setPage}
            isFetching={isFetching}
          />
        )}
      </section>
    </div>
  )
}

// Sub-components
const OrderHeader = () => (
  <div className="mb-10">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
      <h2 className="text-2xl tracking-widest font-light">Order History</h2>
    </div>
    <hr className="mt-4 border h-[1px] border-[#11111133]" />
  </div>
)

const TableHeader = () => (
  <thead className="bg-gray-200">
    <tr>
      {[
        'Order ID',
        'Order Date',
        'Event Date',
        'Dress Name',
        'Payment',
        'Delivery Status',
        'Total Cost',
        'Tracking',
        'Actions',
      ].map((header, index) => (
        <th
          key={index}
          className="py-3 px-4 sm:px-6 lg:px-10 text-left text-gray-600 font-normal text-sm whitespace-nowrap"
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
)

const LoadingRow = () => (
  <tr>
    <td colSpan={9} className="text-center py-10 text-gray-500">
      Loading orders...
    </td>
  </tr>
)

const EmptyRow = () => (
  <tr>
    <td colSpan={9} className="text-center py-10 text-gray-500">
      No bookings found.
    </td>
  </tr>
)

interface OrderRowProps {
  order: Order
  onChat: (order: Order) => void
  isChatLoading: boolean
  onCancelBooking: (id: string) => void
  isCancelling: boolean
}

const OrderRow = ({
  order,
  onChat,
  isChatLoading,
  onCancelBooking,
  isCancelling,
}: OrderRowProps) => {

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const startDate = new Date(order.rentalStartDate).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  )
  const endDate = new Date(order.rentalEndDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const statusColor =
    order.deliveryStatus === 'Delivered'
      ? 'green'
      : order.deliveryStatus === 'Pending'
        ? 'yellow'
        : 'red'
  const isPickupMethod = [order.deliveryMethod, order.shippingMethod].some(
    method => method?.toLowerCase().includes('pickup'),
  )

  return (
    <tr className="border-b">
      <td className="py-6 px-4 sm:px-6 lg:px-10 text-base text-gray-900 border-r font-light tracking-wide border-gray-300">
        {order._id}
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 text-base text-gray-900 border-r font-light tracking-wide border-gray-300">
        {orderDate}
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 text-base font-light tracking-wide text-gray-900 border-r border-gray-300 whitespace-nowrap">
        {startDate} - {endDate}
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 font-light tracking-wide text-base text-gray-900 border-r border-gray-300">
        {order.dressName || 'N/A'}
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 font-light tracking-wide text-base text-gray-900 border-r border-gray-300">
        {order.paymentStatus}
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 font-light tracking-wide text-base text-gray-900 border-r border-gray-300">
        <span
          className={clsx('px-2 py-1 rounded-full text-xs', {
            'bg-green-100 text-green-800': statusColor === 'green',
            'bg-yellow-100 text-yellow-800': statusColor === 'yellow',
            'bg-red-100 text-red-800': statusColor === 'red',
          })}
        >
          {order.deliveryStatus}
        </span>
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 text-base text-gray-900 border-r border-gray-300 font-light tracking-wide">
        ${order.totalAmount}
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 text-base text-gray-900 border-r border-gray-300 font-light tracking-wide">
        {isPickupMethod ? (
          <button
            className="inline-flex items-center gap-1.5 px-0 h-auto text-black underline hover:opacity-60 transition-all font-light whitespace-nowrap disabled:opacity-50"
            title="Chat with Lender"
            onClick={() => onChat(order)}
            disabled={isChatLoading}
          >
            {isChatLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
            Chat
          </button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="px-0 h-auto text-black underline hover:opacity-60 transition-all font-light whitespace-nowrap"
                title="Track Order"
              >
                Track Order
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-sm border-b pb-2 mb-1">Tracking Details</h4>
                <div className="text-sm flex justify-between">
                  <span className="text-gray-500">Method:</span>
                  <span className="font-medium">{order.shippingMethod || order.deliveryMethod || 'N/A'}</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span className="text-gray-500">Tracking No:</span>
                  <span className="font-medium">{order.trackingNumber || 'N/A'}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </td>

      <td className="py-6 px-4 sm:px-6 lg:px-10 text-base text-gray-900 font-light tracking-wide text-center">
        {/* Cancel Booking */}
        <button
          className={clsx('mx-auto px-0 h-auto transition-all uppercase text-xs tracking-widest', {
            'text-red-500 hover:text-red-700': !isCancelling,
            'text-gray-400 cursor-not-allowed animate-pulse': isCancelling,
          })}
          title={isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          onClick={() => {
            if (window.confirm('Are you sure you want to cancel this booking?')) {
              onCancelBooking(order._id)
            }
          }}
          disabled={isCancelling}
        >
          {isCancelling ? 'CANCELLING...' : 'CANCEL'}
        </button>
      </td>

    </tr>
  )
}

interface PaginationProps {
  pagination: PaginationInfo
  currentPage: number
  onPageChange: (page: number) => void
  isFetching: boolean
}

const Pagination = ({
  pagination,
  currentPage,
  onPageChange,
  isFetching,
}: PaginationProps) => {
  const { totalPages, hasPrevPage, hasNextPage } = pagination

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 md:mt-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage || isFetching}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          )
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            disabled={isFetching}
            className={clsx(
              'px-3 py-1 border rounded transition-colors',
              currentPage === page
                ? 'bg-black text-white border-black'
                : 'border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed',
            )}
          >
            {page}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || isFetching}
        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        &gt;
      </button>
    </div>
  )
}

export default OrderHistory
