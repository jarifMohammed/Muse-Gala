'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Instagram, Phone, MapPin, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Lender } from '../../types/listingsTypes'

interface Props {
  open: boolean
  onClose: () => void
  listingId: string | null
}

export default function ListingReviewModal({
  open,
  onClose,
  listingId,
}: Props) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''
  const [insuranceFee, setInsuranceFee] = useState<number>(5)
  const [reasonsForRejection, setReasonsForRejection] = useState<string>('')
  const [dressName, setDressName] = useState<string>('')

  // Fetch listing data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lender-listing', listingId],
    enabled: !!listingId && open,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${listingId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch listing data')
      return res.json()
    },
  })

  const listing = data?.data
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    if (listing?.dressName) {
      setDressName(listing.dressName)
    }
    if (listing?.description) {
      setDescription(listing.description)
    }
  }, [listing?.dressName, listing?.description])

  // --- Approve/Reject Mutation ---
  const statusMutation = useMutation({
    mutationFn: async (newStatus: 'approved' | 'rejected') => {
      const payload: {
        approvalStatus: string
        insuranceFee?: number
        reasonsForRejection?: string
        dressName?: string
        description?: string
      } = { approvalStatus: newStatus }

      if (newStatus === 'approved') {
        payload.insuranceFee = insuranceFee
        payload.dressName = dressName
        payload.description = description
      } else {
        payload.reasonsForRejection = reasonsForRejection
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/${listing._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) throw new Error(`Failed to update status to ${newStatus}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lender-listing'] })
      toast.success('Listing status updated successfully')
      onClose()
    },
  })

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full h-[90vh] p-0 pt-8 pb-6 pr-2 overflow-hidden font-sans text-gray-600">
        <ScrollArea className="h-[90vh] px-6">
          <DialogHeader>
            <div className="flex justify-center my-8">
              <Image
                src={'/logo.png'}
                alt="modal-Alert"
                width={70}
                height={70}
              />
            </div>
            <DialogTitle className="text-2xl font-light tracking-wide mb-6 pb-8 ">
              Review Submission:{' '}
              <span className="font-normal">
                {listing?.dressId?.slice(0, 20) ?? '#####'}
              </span>
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <p className="text-gray-600 text-base">Loading...</p>
          ) : isError ? (
            <p className="text-red-500 text-base">Failed to load data</p>
          ) : listing ? (
            <div className="space-y-8 text-base">
              {/* ID fields */}
              <div>
                <label className="font-medium">Submission ID</label>
                <input
                  value={listing._id}
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Lenders Information */}
              <div className="space-y-4">
                <label className="font-semibold text-lg text-black">Lenders Information</label>
                {listing.lenders && listing.lenders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.lenders.map((lender: Lender) => (
                      <div key={lender._id} className="border rounded-xl p-4 bg-gray-50/50 shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200">
                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                          <div className="bg-black/5 p-2 rounded-full">
                            <User className="w-5 h-5 text-black" />
                          </div>
                          <span className="font-bold text-gray-900">{lender.fullName}</span>
                        </div>
                        
                        <div className="space-y-2.5 text-sm">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="hover:text-black transition-colors">{lender.phoneNumber}</span>
                          </div>
                          
                          {lender.instagramHandle && (
                            <div className="flex items-center gap-3 text-gray-600">
                              <Instagram className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="hover:text-black transition-colors">@{lender.instagramHandle.replace('@', '')}</span>
                            </div>
                          )}
                          
                          <div className="flex items-start gap-3 text-gray-600 leading-tight">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <span>{lender.businessAddress}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="font-medium">Lender Name</label>
                    <input
                      value={listing.lenderId?.fullName ?? ''}
                      readOnly
                      className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium">Dress Name</label>
                <input
                  value={dressName}
                  onChange={(e) => setDressName(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="font-medium">Brand</label>
                <input
                  value={listing.brand}
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="font-medium">Sizes</label>
                <input
                  value={
                    Array.isArray(listing.size)
                      ? listing.size
                        .map(
                          (s: string) =>
                            s.charAt(0).toUpperCase() + s.slice(1)
                        )
                        .join(', ')
                      : listing.size
                        ? listing.size.charAt(0).toUpperCase() +
                        listing.size.slice(1)
                        : ''
                  }
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Color */}
              <div>
                <label className="font-medium">Color</label>
                <input
                  value={
                    Array.isArray(listing.colour)
                      ? listing.colour
                        .map(
                          (c: string) =>
                            c.charAt(0).toUpperCase() + c.slice(1)
                        )
                        .join(', ')
                      : listing.colour
                        ? listing.colour.charAt(0).toUpperCase() +
                        listing.colour.slice(1)
                        : ''
                  }
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Media */}
              <div>
                <label className="font-medium">Media</label>
                <div className="flex gap-4 mt-3 flex-wrap">
                  {listing.media?.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="w-28 h-32 relative rounded overflow-hidden border"
                    >
                      <Image
                        src={img}
                        alt={`media-${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Price (4 Days)</label>
                  <input
                    value={`$${listing.rentalPrice?.fourDays ?? 0}`}
                    readOnly
                    className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-medium">Price (8 Days)</label>
                  <input
                    value={`$${listing.rentalPrice?.eightDays ?? 0}`}
                    readOnly
                    className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                  />
                </div>
              </div>

              {/* Pickup Option */}
              <div>
                <label className="font-medium">Pickup Options</label>
                <input
                  value={
                    Array.isArray(listing.pickupOption)
                      ? listing.pickupOption.join(', ')
                      : listing.pickupOption ?? ''
                  }
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Occasion */}
              <div>
                <label className="font-medium">Occasion</label>
                <input
                  value={
                    Array.isArray(listing.occasion)
                      ? listing.occasion.join(', ')
                      : listing.occasion ?? ''
                  }
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Insurance Fee */}
              <div>
                <label className="font-medium">Insurance Fee ($)</label>
                <input
                  type="number"
                  value={insuranceFee}
                  onChange={(e) => setInsuranceFee(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Rejection Note */}
              <div>
                <label className="font-medium">Rejection Note</label>
                <textarea
                  value={reasonsForRejection}
                  onChange={(e) => setReasonsForRejection(e.target.value)}
                  placeholder="Enter rejection reason if applicable"
                  rows={2}
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-start gap-4 pt-6 pb-8">
                <Button
                  onClick={() => statusMutation.mutate('approved')}
                  disabled={statusMutation.isPending}
                  className="px-8 py-2 text-base"
                >
                  {statusMutation.isPending ? 'Processing...' : 'Approve'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => statusMutation.mutate('rejected')}
                  disabled={statusMutation.isPending}
                  className="px-8 py-2 text-base text-red-600 border-red-500 hover:bg-red-100 hover:text-gray-800 "
                >
                  {statusMutation.isPending ? 'Processing...' : 'Reject'}
                </Button>
              </div>
            </div>
          ) : (
            <p>No data found.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
