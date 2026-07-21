import { auth } from '@/auth'
import { TooltipProvider } from '@/components/ui/tooltip'
import { redirect } from 'next/navigation'
// import '../globals.css'
import Sidebar from './_components/sidebar'
import Topbar from './_components/top-bar'
import ClientProvider from '@/components/Providers/clientProvider'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cu = await auth()

  if (!cu?.user) redirect('/sign-in')

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/20">
      <Sidebar
        token={cu?.user.accessToken as string}
        userID={cu?.user?.id as string}
      />
      {/* Main Content */}
      <div className="lg:pl-64 flex flex-1 flex-col min-w-0">
        {/* Top Bar */}
        <ClientProvider session={cu} />
        <Topbar
          token={cu?.user.accessToken as string}
          userID={cu?.user?.id as string}
        />

        <TooltipProvider>{children}</TooltipProvider>

        {/* Footer */}
        {/* <DashboardFooter /> */}
      </div>
    </div>
  )
}
