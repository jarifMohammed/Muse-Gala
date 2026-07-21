// ================================================================
// customer-action.tsx
// ================================================================
'use client'

import { useState } from 'react'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ProfileTab from './actions/profile-tab'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import BookingsTab from './actions/bookings-tab'
import DisputesTab from './actions/diputes-tab'
import TimelineTab from './actions/timeline-tab'
import PaymentsTab from './actions/payments-tab'
import DocumentsTab from './actions/document-tab'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CustomerProfile {
  _id: number
  firstName: string
  lastName: string
  email: string
  createdAt?: string
  totalBookings?: number
  totalSpent?: number
  // add more fields as needed
}

// ------------------------------------------------------
// Pagination Structure
// ------------------------------------------------------
export interface PaginationInfo {
  page: number
  limit: number
  total: number
}

// ------------------------------------------------------
// Customer Details Response
// ------------------------------------------------------
export interface CustomerDetailsResponse {
  status: boolean
  message: string
  data: {
    customerProfile: CustomerProfile
    bookingHistory: any[]
    customerDisputes: any[]
    timeline: any[]
  }
}

interface Props {
  customerId: string
}

const CustomerAction = ({ customerId }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const cu = useSession()
  const accessToken = cu?.data?.user?.accessToken || ''

  const { data: customerDetails, isLoading: loading } = useQuery({
    queryKey: ['customer-details', customerId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data: CustomerDetailsResponse = await response.json()

      if (!data.status) throw new Error('Failed to fetch customer details')

      return data.data
    },
    enabled: isOpen, // fetch ONLY when dialog opens
  })

  const tabs = customerDetails
    ? [
        {
          id: 'profile',
          label: 'Profile',
          content: <ProfileTab data={customerDetails.customerProfile} />,
        },

        {
          id: 'bookings',
          label: 'Bookings',
          content: <BookingsTab data={customerDetails.bookingHistory} />,
        },
        {
          id: 'payments',
          label: 'Payments',
          content: <PaymentsTab data={customerDetails.bookingHistory} />,
        },
        {
          id: 'disputes',
          label: 'Disputes',
          content: <DisputesTab data={customerDetails.customerDisputes} />,
        },
        {
          id: 'documents',
          label: 'Documents',
          content: <DocumentsTab data={customerDetails.customerProfile} />,
        },
        {
          id: 'timeline',
          label: 'Timeline',
          content: <TimelineTab data={customerDetails.timeline} />,
        },
      ]
    : []

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="px-4" variant="default" size="sm">
            View
          </Button>
        </DialogTrigger>

        <DialogContent
          className="
    w-full 
    !max-w-[80vw]
    md:!max-w-[75vw]
    lg:!max-w-[60vw]
    h-auto 
    px-6
    py-2
    pb-12 
    space-y-5 
    overflow-y-auto
  "
        >
          <DialogHeader>
            <DialogTitle>
              <div className="py-5 flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Muse Gala Logo"
                  width={70}
                  height={70}
                />
              </div>
              Customer Details: {customerDetails?.customerProfile.firstName}{' '}
              {customerDetails?.customerProfile.lastName} (ID: {customerId})
            </DialogTitle>
          </DialogHeader>

          <div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p>Loading customer details...</p>
              </div>
            ) : customerDetails ? (
              <AnimatedTabs
                tabs={tabs}
                defaultTab="profile"
                className="bg-white rounded-[15px] shadow-sm"
                tabClassName="min-w-[80px]"
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <p>No data available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomerAction
