import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import moment from 'moment'
import { CustomerProfile } from '../customer-action'

interface Props {
  data: CustomerProfile
}

const ProfileTab = ({ data }: Props) => {
  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="font-light font-sans">
            Profile Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="font-light text-[14px] font-sans">
          <div className="space-y-2 text-base">
            <p>Name: {`${data.firstName} ${data.lastName} `}</p>
            <p>Customer ID: {data._id}</p>
            <p>Email: {data?.email}</p>
            <p>
              Join Date: {moment(data.createdAt).format('MMMM DD, YYYY h:mm A')}
            </p>
            <p>Total Bookings: {data.totalBookings}</p>
            <p>Total Spent: ${data.totalSpent}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileTab
