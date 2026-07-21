import { auth } from '@/auth'
import { redirect } from 'next/navigation'

import HeaderCards from './_components/HeaderCards'
import SupportTabs from './_components/SupportTabs'
import { Ticket } from './_components/supportTable'


async function fetchTicketsSSR(accessToken: string): Promise<Ticket[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/support/get`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  )
  if (!res.ok) return []
  const json = await res.json()
  return json.data.contacts || []
}

const Page = async () => {
  const cu = await auth()
  if (!cu?.user) redirect('/sign-in')

  const accessToken = cu.user.accessToken
  const tickets = await fetchTicketsSSR(accessToken)

  return (
    <div className="space-y-10">
      <HeaderCards />
      <SupportTabs tickets={tickets} />
    </div>
  )
}

export default Page
