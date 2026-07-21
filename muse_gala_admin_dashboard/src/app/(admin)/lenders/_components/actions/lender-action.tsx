/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LenderProfile } from '@/types/lender'
import { useQuery } from '@tanstack/react-query'

// import NotesTab from './notes-tab'
import ProfileTab from './profile-tab'
import StatusTab from './status-tab'
import MetricsTab from './matrics-tab'
import ListingTab from './listing-tab'
import DisputesTab from './disputs-tab'
import PayoutTab from './payout-tab'
import TimelineTab from './timeline-tab'

interface Props {
  data: LenderProfile
}

interface LenderDetailResponse {
  success: boolean
  data: {
    lender: LenderProfile
    bookings: {
      count: number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any[]
    }
    listings: {
      approvedCount: number
      data: any[]
    }
    disputes: {
      count: number
      data: any[]
    }
    payouts: {
      totalPaidAmount: number
    }
  }
}

const LenderAction = ({ data }: Props) => {
  // Fetch detailed lender data with all related information
  const { data: lenderDetails, isLoading } = useQuery<LenderDetailResponse>({
    queryKey: ['lender-details', data._id],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/admin/${data._id}?booking=true`,
      ).then(res => res.json()),
    enabled: !!data._id, // Only fetch when we have an ID
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to avoid repeated calls
  })

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: <ProfileTab data={lenderDetails?.data?.lender || data} />,
    },
    {
      id: 'status',
      label: 'Status',
      content: <StatusTab data={lenderDetails?.data?.lender || data} />,
    },
    {
      id: 'metrics',
      label: 'Metrics',
      content: <MetricsTab data={lenderDetails?.data} isLoading={isLoading} />,
    },
    {
      id: 'listings',
      label: 'Listings',
      content: (
        <ListingTab
          data={lenderDetails?.data?.listings}
          isLoading={isLoading}
        />
      ),
    },
    {
      id: 'disputes',
      label: 'Disputes',
      content: (
        <DisputesTab
          data={lenderDetails?.data?.disputes}
          isLoading={isLoading}
        />
      ),
    },
    {
      id: 'payout',
      label: 'Payout & Payment',
      content: <PayoutTab data={lenderDetails?.data?.lender || (data as any)} />,
    },
    // {
    //   id: 'notes',
    //   label: 'Notes',
    //   content: <NotesTab lenderId={data._id} />,
    // },
    {
      id: 'timeline',
      label: 'Timeline',
      content: <TimelineTab data={lenderDetails?.data?.lender || data} />,
    },
  ]

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            View
          </Button>
        </DialogTrigger>

        <DialogContent
          className="
            w-full 
            !max-w-[95vw]
            md:!max-w-[80vw]
            lg:!max-w-[70vw]
            h-auto 
            px-4 
            py-2 
            space-y-5 
            overflow-y-auto
          "
        >
          <DialogHeader>
            <DialogTitle>
              Lender Details: {data.fullName} (ID: {data._id})
            </DialogTitle>
          </DialogHeader>

          <div>
            <AnimatedTabs
              tabs={tabs}
              defaultTab="profile"
              className="bg-white rounded-[15px] shadow-sm"
              tabClassName="min-w-[80px]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LenderAction
