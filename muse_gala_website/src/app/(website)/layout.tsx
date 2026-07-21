import { auth } from '@/auth'
import ClientProvider from '@/components/clientProvider'
import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/section/navbar'

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <div className="">
      <Navbar isLoggedin={!!session} session={session!} />
      <ClientProvider session={session} />
      <div className="min-h-[calc(100vh-100px)]">{children}</div>
      <Footer />
    </div>
  )
}
