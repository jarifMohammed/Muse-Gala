import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CustomersHeader from './_components/customersHeader'
import CustomerSearchHeader from './_components/customer-search-header'
import CustomerTableContainer from './_components/customer-table-container'

const Page = async () => {
  const cu = await auth()
  if (!cu?.user) redirect('/sign-in')

  const accessToken = cu.user.accessToken
  // console.log('accessToken', accessToken)

  return (
    <div className="space-y-[30px] p-[10px] font-sans">
      <CustomersHeader />
      <CustomerSearchHeader />
      <CustomerTableContainer accessToken={accessToken} />
    </div>
  )
}

export default Page
