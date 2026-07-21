'use client'

import type React from 'react'

// Packages
import { Menu, Search, User, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
// Components
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Session } from 'next-auth'
import { TrendingProduct } from '@/types/trending-products'
import { SearchProductCard } from './SearchProductCard'
import { useDebounce } from '@/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
// import { Input } from "@/components/ui/input";

interface Props {
  isLoggedin?: boolean
  session?: Session
}

const Navbar = ({ isLoggedin, session }: Props) => {
  const [scrolling, setScrolling] = useState(false)
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchModalRef = useRef<HTMLDivElement>(null)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['navbar-search', debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery.trim()) return { data: [] }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dresses?search=${debouncedSearchQuery}`
      )
      return res.json()
    },
    enabled: isSearchOpen && debouncedSearchQuery.trim().length > 0,
  })

  const menus = [
    { id: 1, href: '/', linkText: 'HOME' },
    { id: 2, href: '/shop', linkText: 'RENT' },
    // { id: 3, href: "/about", linkText: "ABOUT" },
    { id: 4, href: '/how-it-works', linkText: 'HOW IT WORKS' },
    // { id: 5, href: '/become-lender', linkText: 'BECOME A LENDER' },
    { id: 6, href: '/find-near-you/map', linkText: 'FIND NEAR YOU' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Reset search when modal closes
    if (!isSearchOpen) {
      setSearchQuery('')
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle search modal click outside
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }

      // Handle account dropdown click outside
      if (
        isAccountOpen &&
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsAccountOpen(false)
      }
    }

    if (isSearchOpen || isAccountOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isSearchOpen, isAccountOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.refresh()
    // router.push('/')
    window.location.href = '/'
    console.log('user logged out!')
  }

  const isHomePage = pathname === '/'

  const getTextColor = () => {
    return scrolling ||
      pathname.startsWith('/product/') ||
      pathname.startsWith('/shop/') ||
      pathname === '/shop' ||
      pathname.startsWith('/account') ||
      pathname.startsWith('/become-lender/form') ||
      pathname === '/about' ||
      pathname === '/how-it-works' ||
      pathname === '/lender-faq' ||
      pathname.startsWith('/find-near-you') ||
      pathname === '/contact-us' ||
      pathname === '/privacy-policy' ||
      pathname === '/terms-and-conditions' ||
      pathname === '/refund-policy' ||
      pathname === '/insurance-policy' ||
      pathname === '/dispute-resolution' ||
      pathname === '/dispute-resolution-policy' ||
      pathname === '/lender-terms-and-conditions' ||
      pathname === '/login' ||
      pathname === '/sign-up' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password' ||
      pathname === '/otp' ||
      pathname === '/booking-success'
      ? 'text-black'
      : 'text-white'
  }

  const getBorderColor = () => {
    return scrolling ||
      pathname.startsWith('/product/') ||
      pathname.startsWith('/shop/') ||
      pathname === '/checkout' ||
      pathname === '/shop' ||
      pathname.startsWith('/account') ||
      pathname.startsWith('/become-lender/form') ||
      pathname === '/about' ||
      pathname === '/how-it-works' ||
      pathname === '/lender-faq' ||
      pathname.startsWith('/find-near-you') ||
      pathname === '/contact-us' ||
      pathname === '/privacy-policy' ||
      pathname === '/terms-and-conditions' ||
      pathname === '/refund-policy' ||
      pathname === '/insurance-policy' ||
      pathname === '/dispute-resolution' ||
      pathname === '/dispute-resolution-policy' ||
      pathname === '/lender-terms-and-conditions' ||
      pathname === '/login' ||
      pathname === '/sign-up' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password' ||
      pathname === '/otp' ||
      pathname === '/booking-success'
      ? 'border-black'
      : 'border-white'
  }

  return (
    <>
      <div
        className={`fixed top-0 z-50 min-w-full py-3 transition duration-300 ${scrolling ? 'bg-white' : isHomePage ? '' : 'bg-transparent mt-0'
          }`}
      >
        <div className="max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6">
          <div className="grid grid-cols-3 items-center w-full">
            {/* Left: Mobile Hamburger and Desktop Links */}
            <div className="flex items-center">
              {/* Mobile Menu (Hamburger) */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="p-1" size="icon">
                      <Menu className={getTextColor()} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="bg-white text-black">
                    <div className="flex flex-col items-center gap-y-8 mt-6">
                      <div className="flex flex-col items-center gap-y-5">
                        {menus.map((menu) => (
                          <Link
                            key={menu.id}
                            href={menu.href}
                            className={`${pathname === menu.href
                              ? 'font-semibold'
                              : 'font-light'
                              } text-lg hover:text-gray-600 transition-colors font-avenir`}
                          >
                            <SheetClose>{menu.linkText}</SheetClose>
                          </Link>
                        ))}
                        {!isLoggedin && (
                          <Link
                            href="/login"
                            className="text-lg font-light hover:text-gray-600 transition-colors font-avenir uppercase"
                          >
                            <SheetClose>Login</SheetClose>
                          </Link>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Menu Links */}
              <div className="hidden md:flex items-center gap-x-2 lg:gap-x-0">
                {menus.filter(m => m.id !== 5).map((menu) => (
                  <Button
                    key={menu.id}
                    variant="link"
                    effect="hoverUnderline"
                    asChild
                    className={`text-[12px] font-avenir font-light ${getTextColor()}`}
                  >
                    <Link
                      href={menu.href}
                      className={`${pathname === menu.href ? 'font-normal' : 'font-light'
                        } leading-[20px] tracking-[0.1em]`}
                    >
                      {menu.linkText}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex-shrink-0">
                {scrolling ||
                  pathname.startsWith('/account') ||
                  pathname.startsWith('/become-lender/form') ||
                  pathname.startsWith('/product/') ||
                  pathname.startsWith('/shop/') ||
                  pathname === '/login' ||
                  pathname === '/sign-up' ||
                  pathname === '/forgot-password' ||
                  pathname === '/reset-password' ||
                  pathname === '/otp' ||
                  pathname === '/checkout' ||
                  pathname === '/shop' ||
                  pathname === '/about' ||
                  pathname === '/how-it-works' ||
                  pathname === '/lender-faq' ||
                  pathname === '/contact-us' ||
                  pathname === '/privacy-policy' ||
                  pathname === '/terms-and-conditions' ||
                  pathname === '/refund-policy' ||
                  pathname === '/insurance-policy' ||
                  pathname === '/dispute-resolution' ||
                  pathname === '/dispute-resolution-policy' ||
                  pathname === '/lender-terms-and-conditions' ||
                  pathname === '/booking-success' ||
                  pathname.startsWith('/find-near-you') ? (
                  <Image
                    src="/logo-black.svg"
                    height={60}
                    width={60}
                    alt="Logo"
                  />
                ) : (
                  <Image src="/logo.svg" height={60} width={60} alt="Logo" />
                )}
              </Link>
            </div>

            {/* Right: Actions (Search, Account, Become a Lender) */}
            <div className={`${getTextColor()} flex gap-[15px] md:gap-[30px] items-center justify-end`}>
              {/* <Link
                href="/become-lender"
                className="brand-button text-[14px] !tracking-[2px] hover:opacity-70 transition-opacity whitespace-nowrap hidden lg:block"
              >
                BECOME A LENDER
              </Link> */}
              <div className="relative" ref={searchRef}>
                <Search
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsSearchOpen(!isSearchOpen)
                  }}
                  size={20}
                />
              </div>

              {/* User Menu */}
              <div className="relative cursor-pointer" ref={accountRef}>
                {!isLoggedin ? (
                  <Link
                    href="/login"
                    className="flex items-center"
                  >
                    <User
                      size={20}
                      className="hover:opacity-70 transition-opacity"
                    />
                  </Link>
                ) : (
                  <>
                    <div
                      onClick={() => setIsAccountOpen(!isAccountOpen)}
                      className={`border rounded-full w-7 h-7 flex items-center justify-center text-sm font-medium ${getBorderColor()} hover:opacity-70 transition-opacity`}
                    >
                      {session?.user?.firstName?.slice(0, 1) || 'U'}
                    </div>
                    {isAccountOpen && (
                      <div className="absolute top-8 right-0 mt-1 z-50 bg-white p-4 md:p-6 shadow-md min-w-[180px]">
                        <div className="flex flex-col items-center space-y-3 md:space-y-6">
                          <Link
                            href="/account"
                            className="block text-center w-full"
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                          >
                            <span className="text-black text-xs md:text-sm tracking-[0.2em] uppercase font-avenir font-light">
                              MY ACCOUNT
                            </span>
                            <div className="h-[1px] bg-black w-full mt-1"></div>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="block text-center w-full"
                          >
                            <span className="text-black text-xs md:text-sm tracking-[0.2em] uppercase font-avenir font-light">
                              SIGN OUT
                            </span>
                            <div className="h-[1px] bg-black w-full mt-1"></div>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Full-width Search Dropdown */}
      {
        isSearchOpen && (
          <div
            ref={searchModalRef}
            className="fixed top-[70px] left-0 md:left-[14%] w-full md:w-[72%] bg-white border-b border-gray-200 shadow-lg z-[60] animate-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from bubbling up
          >
            <div className="container mx-auto py-8 px-4">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-4"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="SEARCH FOR DRESSES..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-0 border-b border-black focus:border-black focus:outline-none px-0 py-2 placeholder:text-gray-400 font-avenir tracking-widest text-sm uppercase"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsSearchOpen(false)
                  }}
                  className="text-gray-400 hover:text-black transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </form>

              {/* Search Results Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {isSearchLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-pulse flex gap-2">
                        <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-.5s]"></div>
                      </div>
                    </div>
                  ) : searchResults?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.data.map((product: TrendingProduct) => (
                        <SearchProductCard
                          key={product._id}
                          product={product}
                          onClick={() => setIsSearchOpen(false)}
                        />
                      ))}
                    </div>
                  ) : (
                    debouncedSearchQuery.trim().length > 0 && (
                      <div className="text-center py-10">
                        <p className="text-gray-500 font-avenir tracking-widest text-sm uppercase">
                          No dresses found for &quot;{searchQuery}&quot;
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Overlay to close search when clicking outside */}
      {
        isSearchOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-[59]"
            onClick={(e) => {
              // This will be handled by the click outside detection
              // We don't want to close here directly as it would interfere with our logic
              e.stopPropagation()
            }}
          />
        )
      }
    </>
  )
}

export default Navbar
