import { auth } from '@/auth'
import ListingsClient from './components/ListingsClient'
import { redirect } from 'next/navigation'

export default async function Page() {
  // Redirect user if not logged in
  const cu = await auth()
  if (!cu?.user) redirect('/sign-in')

  // getting access token
  const accessToken = cu.user.accessToken!

  return <ListingsClient accessToken={accessToken} />
}
