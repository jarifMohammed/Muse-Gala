'use client'
import { Card } from '@/components/ui/card'
import AlertModal from '@/components/ui/custom/alert-modal'
import SkeletonWrapper from '@/components/ui/custom/skeleton-wrapper'
import { Listing } from '@/types/listings/index'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ListingDetailsOverview from './listing-detials-first-three-component/listingDetails-overview'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface Props {
  listingId: string
  token: string
}

interface ApiProps {
  status: true
  message: string
  data: Listing
}

const ListingDetailsContainer = ({ listingId, token }: Props) => {
  const [isRouteChanging, setIsRouteChangin] = useState(false)
  const [editAlertDialog, setEditAlertDialog] = useState(false)

  const router = useRouter()
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<ApiProps>({
      queryKey: ['listing', listingId],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${listingId}`,
          {
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json()),
    })

  useEffect(() => {
    return () => {
      setIsRouteChangin(false)
    }
  }, [])

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Something went wrong!
          </h2>
          <p className="text-red-600 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 bg-[#fefaf6] space-y-8">
      <Button onClick={() => router.back()} variant={'default'}>
        <span>
          <ArrowLeft />
        </span>
        Go Back
      </Button>
      <h2 className="text-[20px] font-normal uppercase  ">LISTINGS DETAILS</h2>

      {/* {data?.data.approvalStatus === "rejected" && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-red-500 font-medium">
            {data?.data.reasonsForRejection}
          </AlertDescription>
        </Alert>
      )} */}

      <ListingDetailsOverview
        isLoading={isLoading || isRefetching}
        data={data?.data}
        accessToken={token}
      />

      <SkeletonWrapper isLoading={isLoading || isRefetching}>
        <Card className="bg-white p-6 rounded-[15px] ">
          <h3 className="text-2xl font-normal mb-4">Description & Details</h3>

          <div className="space-y-4">
            <p className="text-base font-normal">
              <span className="font-normal">Description:</span>{' '}
              {data?.data.description}
            </p>
            <p className="text-base">
              <span className="font-normal">Materials:</span>{' '}
              {data?.data.material}
            </p>
            <p className="text-base">
              <span className="font-normal">Care Instructions:</span>{' '}
              {data?.data.careInstructions}
            </p>
          </div>
        </Card>
      </SkeletonWrapper>

      {/* <div className="grid grid-cols-2 gap-5">
        <SkeletonWrapper isLoading={isLoading}>
          <Card className=" w-full">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-semibold text-gray-900 ">
                  Availability Calendar
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar
                year={2025}
                month={7} // August (0-based index)
                greenDates={[2, 12, 24, 16]}
                redDates={[4, 10]}
                yellowDates={[14, 15]}
              />
            </CardContent>
          </Card>
        </SkeletonWrapper>
      </div> */}

      <AlertModal
        loading={isRouteChanging}
        onConfirm={() => {
          setIsRouteChangin(true)
          router.push(`/listings/${data?.data._id}/edit`)
        }}
        onClose={() => setEditAlertDialog(false)}
        title="Edit Listing Confirmation"
        message="Editing this listing will require admin re-approval. Your changes may temporarily affect its visibility and impact your business performance. Do you want to continue?"
        isOpen={editAlertDialog}
      />
    </div>
  )
}

export default ListingDetailsContainer
