import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LenderProfile } from '@/types/lender'

interface Props {
  data: LenderProfile
}

const PayoutTab = ({ data }: Props) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Payout Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-none rounded-[6px]">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Preferred Method</span>
              <span className="font-medium">{data.payoutSettings?.preferredMethod || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Manual Method</span>
              <span className="font-medium">{data.payoutSettings?.manualMethod || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">KYC Status</span>
              {getStatusBadge(data.kycStatus)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-[6px]">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Stripe Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Stripe ID</span>
              <span className="font-medium font-mono text-xs">{data.stripeAccountId || 'Not Connected'}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Onboarding</span>
              <span className={data.stripeOnboardingCompleted ? 'text-green-600' : 'text-yellow-600'}>
                {data.stripeOnboardingCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payouts Enabled</span>
              <span className={data.payoutsEnabled ? 'text-green-600' : 'text-red-600'}>
                {data.payoutsEnabled ? 'Yes' : 'No'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank & PayID Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-none rounded-[6px]">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Account Name</span>
              <span className="font-medium">{data.payoutSettings?.bankDetails?.accountName || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Bank Name</span>
              <span className="font-medium">{data.payoutSettings?.bankDetails?.bankName || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">BSB</span>
              <span className="font-medium font-mono">{data.payoutSettings?.bankDetails?.bsb || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Account Number</span>
              <span className="font-medium font-mono">{data.payoutSettings?.bankDetails?.accountNumber || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-[6px]">
          <CardHeader>
            <CardTitle className="text-sm font-medium">PayID & Other Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.payoutSettings?.payIDDetails ? (
              <>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-500">PayID Type</span>
                  <span className="font-medium">{data.payoutSettings.payIDDetails.type}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-500">PayID Value</span>
                  <span className="font-medium">{data.payoutSettings.payIDDetails.value}</span>
                </div>
              </>
            ) : (
              <div className="border-b pb-2 italic text-gray-400">No PayID details provided</div>
            )}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Charges Enabled</span>
              <span className={data.chargesEnabled ? 'text-green-600' : 'text-red-600'}>
                {data.chargesEnabled ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Stripe Customer ID</span>
              <span className="font-medium font-mono text-xs">{data.stripeCustomerId || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification & Review */}
      <Card className="shadow-none rounded-[6px]">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Application History</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-500">Submitted At</span>
            <span>{data.applicationSubmittedAt ? new Date(data.applicationSubmittedAt).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-500">Reviewed At</span>
            <span>{data.applicationReviewedAt ? new Date(data.applicationReviewedAt).toLocaleString() : 'Not Reviewed'}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 md:border-b-0 md:pb-0">
            <span className="text-gray-500">ABN Number</span>
            <span className="font-medium">{data.abnNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Details Submitted</span>
            <span className={data.detailsSubmitted ? 'text-green-600' : 'text-yellow-600'}>
              {data.detailsSubmitted ? 'Yes' : 'No'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PayoutTab
