
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LenderProfile } from '@/types/lender'
import moment from 'moment'
interface Props {
  data: LenderProfile
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
          <div className="space-y-2">
            <p>Name: {data.fullName}</p>
            <p>Lender ID: {data._id}</p>
            <p>Email: {data.email}</p>
            <p>Phone: {data.phoneNumber}</p>
            <p>
              Join Date: {moment(data.createdAt).format('MMMM DD, YYYY h:mm A')}
            </p>
            <p>Address: {data.businessAddress}</p>
            <p>Business Address: {data.address}</p>
            <p>Post Code: {data.postcode}</p>
          </div>
        </CardContent>
      </Card>

      

      {/* {data.latitude && data.longitude && (
        <Card className="shadow-none rounded-[6px] p-0 ">
          <CardContent className="p-5 pb-0">
            <MapBoxView
              latitude={data.latitude}
              longitude={data.longitude}
              zoom={13}
              className="w-full h-[400px] rounded-lg"
            />
          </CardContent>
        </Card>
      )} */}
    </div>
  )
}

export default ProfileTab
