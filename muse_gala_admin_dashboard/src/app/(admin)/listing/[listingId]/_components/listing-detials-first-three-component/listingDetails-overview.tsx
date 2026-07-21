'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SkeletonWrapper from '@/components/ui/custom/skeleton-wrapper'
import ResponsiveDialog from '@/components/ui/responsive-dialog'
import { Listing } from '@/types/listings'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, X } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import ListingRejectionForm from './Rejection-form'

// carousel import

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface Props {
  isLoading: boolean
  data?: Listing | null
  accessToken: string
}

const ListingDetailsOverview = ({ isLoading, data, accessToken }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const isActive = data?.approvalStatus === 'approved'

  const queryClient = useQueryClient()

  const { mutate, isPending: isApproving } = useMutation({
    mutationKey: ['approveMutation'],
    mutationFn: (reqBody: {
      approvalStatus: Listing['approvalStatus']
      reasonsForRejection?: string
    }) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/${data?._id}`,
        {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(reqBody),
        }
      ).then((res) => res.json()),
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message)
        return
      }

      toast.success('Listing is approved')
      queryClient.invalidateQueries({ queryKey: ['listing', data?._id] })
    },
  })

  const onApprove = () => {
    mutate({
      approvalStatus: 'approved',
      reasonsForRejection: '',
    })
  }

  // carousel hook

  return (
    <>
      <SkeletonWrapper isLoading={isLoading}>
        <Card className="grid grid-cols-1 lg:grid-cols-12 gap-6  shadow-none">
          {/* IMAGE CAROUSEL */}
          <div className="lg:col-span-4">
            <div className="w-full h-[400px] px-4 pl-5">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {(data?.media?.length
                    ? data.media
                    : [
                        'https://files.edgestore.dev/vkpagg64z2y0yvdx/publicFiles/_public/4420c9d1-dd2e-4afa-9b54-8a85d396ecbc.jpeg',
                      ]
                  ).map((src, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative w-full h-[400px]">
                        <Image
                          src={src}
                          alt={data?.dressName ?? `image-${idx}`}
                          fill
                          className="object-contain rounded-l-[6px]"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-8 bg-white p-6 rounded-r-[15px] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">
                  {data?.brand} - {data?.dressName}
                </h3>
                <p className="text-sm text-gray-500">
                  Product ID: {data?.dressId}
                </p>
              </div>
              <div className="flex space-x-3">
                {!isActive && (
                  <Button
                    effect="ringHover"
                    onClick={onApprove}
                    disabled={isApproving}
                  >
                    Approve{' '}
                    {isApproving && <Loader2 className="animate-spin ml-2" />}
                  </Button>
                )}
                <Button
                  effect="ringHover"
                  onClick={() => setIsEditing((p) => !p)}
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-base mb-3">
                <span className="font-medium">Size: </span>
                {data?.size}
              </p>
              <div className="text-base mb-3 flex items-center">
                <span className="font-medium">Color: </span>
                <div
                  style={{ backgroundColor: data?.colour }}
                  className="h-5 w-5 rounded-full ml-3"
                />
              </div>
              <p className="text-base mb-3">
                <span className="font-medium">Condition:</span>{' '}
                {data?.condition}
              </p>
              <p className="text-base mb-3">
                <span className="font-medium mr-2">Rental Price:</span>$
                {data?.rentalPrice.fourDays}/ 4 days
              </p>
              <p className="text-base mb-3">
                <span className="font-medium">Last Updated:</span>{' '}
                {moment(data?.updatedAt).format('DD MMM, YYYY [at] hh:mm A')}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span
                  className={`inline-flex items-center gap-1 px-4 py-1 rounded-2xl text-sm font-medium ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                  {isActive ? (
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </SkeletonWrapper>

      <ResponsiveDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        title="Reject Listing"
        description="Please provide a reason for rejecting this listing. The submitter will be notified with your feedback."
      >
        <ListingRejectionForm
          accessToken={accessToken}
          data={data!}
          onClose={() => setIsEditing(false)}
        />
      </ResponsiveDialog>
    </>
  )
}

export default ListingDetailsOverview
