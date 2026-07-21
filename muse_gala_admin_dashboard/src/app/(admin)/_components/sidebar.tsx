/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { PERMISSION_MAP } from '@/lib/permissions'

const routes = [
  { id: 1, label: 'Overview', href: '/' },
  { id: 2, label: 'Listing', href: '/listing' },
  { id: 3, label: 'Lenders', href: '/lenders' },
  { id: 4, label: 'Customers', href: '/customers' },
  { id: 5, label: 'Bookings', href: '/bookings' },
  { id: 15, label: 'Returns', href: '/returns' },
  { id: 6, label: 'Disputes', href: '/disputes' },
  { id: 7, label: 'Finance', href: '/finance' },
  { id: 8, label: 'Chats', href: '/chats' },
  // { id: 9, label: 'Analytics', href: '/analytics' },
  { id: 10, label: 'Content & CMS', href: '/content-&-cms' },
  { id: 11, label: 'Support', href: '/support' },
  { id: 12, label: 'Newsletter Subscriptions', href: '/newsletter-subscriptions' },
  { id: 13, label: 'Team', href: '/team' },
  { id: 14, label: 'Settings', href: '/settings' },
]

export default function Sidebar({ session }: any) {
  const pathname = usePathname()

  const role = session?.user?.role
  const permissions = session?.user?.permissions || []

  let allowedRoutes = [] as typeof routes

  // SUPER_ADMIN = FULL ACCESS
  if (role === 'SUPER_ADMIN') {
    allowedRoutes = routes
  }

  // ADMIN = Overview always + other permission-based routes
  if (role === 'ADMIN') {
    const allowedPathSet = new Set<string>()
    let hasAllAccess = false

    permissions.forEach((perm: string) => {
      const mapped = PERMISSION_MAP[perm]
      if (mapped) {
        if (mapped.includes('*')) hasAllAccess = true
        else mapped.forEach(p => allowedPathSet.add(p))
      }
    })

    // ALWAYS include Overview
    const overview = routes.find(r => r.href === '/')

    allowedRoutes = hasAllAccess
      ? routes
      : [
        overview!, // force overview always
        ...routes.filter(r => allowedPathSet.has(r.href)),
      ]
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-primary">
      <div className="flex h-full flex-col">
        <div className="border-none p-6 flex justify-center items-center">
          <div className="relative h-[80px] w-[80px]">
            <Image
              src="https://files.edgestore.dev/2pgl62wxp0dbg019/Dev/_public/276405a7-8be0-4e32-b05c-4d6dfb02d288.svg"
              alt="logo"
              fill
            />
          </div>
        </div>

        <nav className="flex-1 overflow-auto p-3 no-scrollbar">
          <ul className="space-y-2">
            {allowedRoutes.map(route => {
              const isActive =
                route.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(route.href)

              return (
                <li key={route.id}>
                  <Link
                    href={route.href}
                    className={`flex text-white/80 items-center gap-3 rounded-md px-3 font-light py-2 
                    ${isActive
                        ? 'bg-white/20 text-primary-foreground'
                        : 'hover:bg-white/10 hover:text-white/70'
                      }`}
                  >
                    <span>{route.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full justify-start gap-3 bg-white/10 text-white/80 font-light hover:bg-white/20 hover:text-white">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to sign out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out and redirected to the homepage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await signOut({ redirectTo: '/', redirect: true })
                  }}
                >
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
