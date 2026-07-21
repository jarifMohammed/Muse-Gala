import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cu = await auth()

  if (!cu?.user) redirect('/sign-in')

  return <div className="p-[10px]">{children}</div>
}
