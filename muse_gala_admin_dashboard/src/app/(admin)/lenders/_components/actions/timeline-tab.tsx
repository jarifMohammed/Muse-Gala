import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import moment from 'moment'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

const TimelineTab = ({ data }: Props) => {
  const timelineEvents = [
    {
      date: data.createdAt,
      event: 'Account Created',
      description: `${data.fullName} joined the platform`,
    },
    data.applicationSubmittedAt && {
      date: data.applicationSubmittedAt,
      event: 'Application Submitted',
      description: 'Lender application submitted for review',
    },
    data.applicationReviewedAt && {
      date: data.applicationReviewedAt,
      event: 'Application Reviewed',
      description: `Application status: ${data.status}`,
    },
    data.subscriptionStartDate && {
      date: data.subscriptionStartDate,
      event: 'Subscription Started',
      description: 'Active subscription plan activated',
    },
    data.stripeOnboardingCompleted &&
      data.updatedAt && {
        date: data.updatedAt,
        event: 'Stripe Onboarding Completed',
        description: 'Payment processing setup completed',
      },
  ].filter(Boolean) as Array<{
    date: string
    event: string
    description: string
  }>

  // Sort by date descending
  const sortedEvents = timelineEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="font-light font-sans">
            Activity Timeline
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {sortedEvents.map((event, index) => (
              <div key={index} className="flex gap-4 relative">
                {index !== sortedEvents.length - 1 && (
                  <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}

                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 mt-1 z-10" />

                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{event.event}</h4>
                    <span className="text-xs text-gray-500">
                      {moment(event.date).format('MMM DD, YYYY')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimelineTab
