import { auth } from '@/auth'
import { redirect } from 'next/navigation'

// import SupportTable from './_components/supportTable'?
import HeaderCards from './_components/headerCards'
import MessageTable from './_components/messagesTable'

const Page = async () => {
  const cu = await auth()
  if (!cu?.user) redirect('/sign-in')


  return (
    <div className="space-y-10">
      <HeaderCards />
      <MessageTable />
    </div>
  )
}

export default Page
