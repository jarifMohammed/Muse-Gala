'use client'
import { ArrowRight, Instagram, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '../ui/button'

const Footer = () => {
  const [email, setEmail] = useState('')

  const { mutate, isPending } = useMutation({
    mutationKey: ['newsletter-subscription-footer'],
    mutationFn: async () => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address')
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/newsletterSubscription/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: '',
            lastName: '',
            email,
            phoneNumber: '',
          }),
        }
      )
      const data = await res.json()
      if (!res.ok || !data.status) throw new Error(data.message || 'Failed to subscribe')
      return data
    },
    onSuccess: () => {
      toast.success('Thank you for subscribing')
      setEmail('')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 pt-14 lg:pt-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* CUSTOMER SECTION */}
          <div className="space-y-5 lg:space-y-4 text-center md:text-left">
            <h3 className="brand-subheader tracking-[0.18em]">CUSTOMER</h3>
            <nav className="flex flex-col space-y-2 lg:space-y-1.5 brand-body leading-relaxed">
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                How It Works
              </Link>
              <Link
                href="/how-it-works/#faq"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                FAQ
              </Link>
              <Link
                href="/contact-us"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Contact
              </Link>
              <Link
                href="/refund-policy"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Refund Policy
              </Link>
              <Link
                href="/insurance-policy"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Insurance Policy
              </Link>
            </nav>
          </div>

          {/* LENDERS SECTION */}
          <div className="space-y-5 lg:space-y-4 text-center md:text-left">
            <h3 className="brand-subheader tracking-[0.18em]">LENDERS</h3>
            <nav className="flex flex-col space-y-2 lg:space-y-1.5 brand-body leading-relaxed">
              <Link
                href="/become-lender"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Become a Lender
              </Link>
              <Link
                href="/lender-faq"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Lender FAQ
              </Link>
              <Link
                href="https://lender.musegala.com.au"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Lender Login
              </Link>
              <Link
                // onClick={() => setOpne(true)}
                href="/lender-terms-and-conditions"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Lender Terms
              </Link>
              {/* <LenderTermsConditions open={open} setOpen={setOpne} /> */}
            </nav>
          </div>

          {/* COMPANY SECTION */}
          <div className="space-y-5 lg:space-y-4 text-center md:text-left">
            <h3 className="brand-subheader tracking-[0.18em]">COMPANY</h3>
            <nav className="flex flex-col space-y-2 lg:space-y-1.5 brand-body leading-relaxed">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                About
              </Link>
              <Link
                href="/privacy-policy"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              {/* <CustomerTermsConditionsDialog open={open1} setOpen={setOpne1} /> */}
              <Link
                href="/dispute-resolution"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Dispute Resolution
              </Link>
            </nav>
          </div>

          {/* STAY CONNECTED SECTION */}
          <div className="space-y-5 lg:space-y-4 text-center md:text-left">
            <h3 className="brand-subheader">
              STAY CONNECTED
            </h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link
                href="https://www.instagram.com/musegala/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
            <div className="space-y-3 lg:space-y-2">
              <p className="brand-body text-gray-600">
                Subscribe to our newsletter
              </p>
              <div className="flex relative flex-col sm:flex-row justify-center md:justify-start items-center max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border brand-body border-t-0 border-l-0 border-r-0 border-[#000000] px-2 py-[10px] mb-4 sm:mb-0 sm:flex-1 w-full outline-none font-avenir font-light"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-0 absolute right-0 sm:ml-2"
                  onClick={() => mutate()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-6 animate-spin" />
                  ) : (
                    <ArrowRight className="h-5 w-6" />
                  )}
                </Button>
              </div>
              <p className="brand-body text-gray-500 leading-relaxed">
                By subscribing, you agree to our{' '}
                <Link href="#" className="text-gray-700 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* LOGO AND PAYMENT METHODS */}
        <div className="mt-14 lg:mt-8 border-t border-gray-200 pt-10 lg:pt-6 pb-10 lg:pb-6 flex flex-col items-center space-y-10 lg:space-y-8 md:grid md:grid-cols-3 md:items-center md:gap-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start md:justify-self-start space-y-4">
            <div className="flex items-center space-x-5">
              <Image
                src="/images/footer/amex.svg"
                alt="Mastercard"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
              <Image
                src="/images/footer/apple.svg"
                alt="American Express"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
              <Image
                src="/images/footer/gpay.svg"
                alt="Apple Pay"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
              <Image
                src="/images/footer/payoneer.svg"
                alt="Google Pay"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
            </div>
          </div>

          <div className="flex flex-col items-center md:justify-self-center w-full md:w-max">
            <div>
              <Image
                src={'/logo-black.svg'}
                width={300}
                height={300}
                alt="logo"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="brand-subheader tracking-[10px] md:tracking-[20px] whitespace-nowrap">MUSE GALA</span>
            </div>
          </div>
          <div className="hidden md:block md:justify-self-end w-[120px]"></div>
        </div>
        <p className="text-center border-t border-gray-300 py-4 brand-body font-avenir font-light tracking-[0.08em]">
          © 2026 MUSE GALA.All rights reserved.
          
        
        </p>
      </div>
    </footer>
  )
}

export default Footer
