import { auth } from '@/auth'
import { redirect } from 'next/navigation'
// import Sidebar from './_components/sidebar'
import Topbar from './_components/top-bar'
import { Toaster } from 'sonner'
import SidebarLayout from './_components/sidebarLayout'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cu = await auth()

  if (!cu?.user) redirect('/sign-in')

  return (
    <div className="flex min-h-screen flex-col bg-[#FEFAF6]">
      <SidebarLayout />
      {/* Main Content */}
      <div className="ml-64 flex flex-1 flex-col ">
        <Topbar name={'' as string} />

        <div className="p-5">{children}</div>
      </div>

      <Toaster />
    </div>
  )
}
