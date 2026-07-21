'use client'
import React, { useEffect } from 'react'
import { useShoppingStore } from '@/zustand/shopingStore'
import { useUserStore } from '@/zustand/useUserStore'

const CheckoutForm = () => {
  const { fullName, email, phone, address, idPreview, setField, isConfirm } =
    useShoppingStore()
  const { user } = useUserStore()

  const formatAustralianPhone = (value?: string) => {
    const digits = (value || '').replace(/\D/g, '')

    if (!digits) return '+61 '

    const localDigits = digits.startsWith('61')
      ? digits.slice(2)
      : digits.startsWith('0')
        ? digits.slice(1)
        : digits

    return `+61 ${localDigits}`.trimEnd()
  }

  const handlePhoneChange = (value: string) => {
    setField('phone', formatAustralianPhone(value))
  }

  // fill form fields from user data
  useEffect(() => {
    if (user) {
      const name =
        user.firstName?.trim() && user.lastName?.trim()
          ? `${user.firstName.trim()} ${user.lastName.trim()}`
          : user.firstName || ''

      setField('fullName', name)
      setField('email', user.email || '')
      setField('phone', formatAustralianPhone(user.phoneNumber))
    }
  }, [user, setField])

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) setField('idVerification', file)
  // }

  return (
    <div className="font-avenir">
      <div>
        {/* Header */}
        <h1 className="font-light opacity-75 text-[18px] md:text-2xl tracking-[0.5rem] uppercase">
          checkout
        </h1>

        {/* Customer Details Section */}
        <div className="mt-5">
          <h2 className="text-[14px] font-light text-black mb-8 border-b border-black pb-2 opacity-75 tracking-[0.2rem]">
            CUSTOMER DETAILS
          </h2>

          {isConfirm && idPreview ? (
            <div className="font-avenir border-b border-black pb-2">
              <h1 className="block text-sm text-black mb-2 uppercase opacity-75">
                Full Name : {fullName}
              </h1>
              <h1 className="block text-sm text-black mb-2  opacity-75">
                Email : {email}
              </h1>
              <h1 className="block text-sm text-black mb-2 uppercase opacity-75">
                Phone Number : {phone}
              </h1>
              <h1 className="block text-sm text-black mb-2 uppercase opacity-75">
                Address: {address}
              </h1>
            </div>
          ) : (
            <div>
              <div className="space-y-8">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-black mb-2 uppercase opacity-75">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-black pb-2 text-black opacity-75 placeholder-gray-400 focus:outline-none focus:border-black uppercase font-avenir"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm text-black mb-2 uppercase opacity-75">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setField('email', e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-black pb-2 text-black opacity-75 placeholder-gray-400 focus:outline-none focus:border-black font-avenir"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm text-black mb-2 uppercase opacity-75">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onFocus={() => {
                      if (!phone) setField('phone', '+61 ')
                    }}
                    className="w-full bg-transparent border-0 border-b border-black pb-2 text-black opacity-75 placeholder-gray-400 focus:outline-none focus:border-black uppercase font-avenir"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-black mb-2 opacity-75 uppercase">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setField('address', e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-black pb-2 text-black opacity-75 placeholder-gray-400 focus:outline-none focus:border-black font-avenir"
                  />
                </div>

                {/* ID Verification → show only if user not verified */}
                {/* {!user?.kycVerified && (
                  <div>
                    <label className="block text-sm text-black mb-4 uppercase opacity-75">
                      ID Verification <span className="text-red-500">*</span>
                    </label>

                    <div className="border-b border-black p-8 text-center">
                      <input
                        type="file"
                        id="id-upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="id-upload" className="cursor-pointer">
                        {idPreview ? (
                          <Image
                            src={idPreview}
                            alt="ID Preview"
                            width={1000}
                            height={1000}
                            className="mx-auto h-32 object-contain mb-2"
                          />
                        ) : (
                          <Upload className="w-8 h-8 mx-auto mb-4 opacity-50 font-thin" />
                        )}
                        <p className="text-sm text-black opacity-75 uppercase">
                          {idPreview ? 'Change file' : 'Click to upload'}
                        </p>
                      </label>
                    </div>
                  </div>
                )} */}
              </div>

              {/* {!user?.kycVerified && (
                <p className="text-sm font-light text-gray-600 mt-6 leading-relaxed font-avenir tracking-[.05rem]">
                  Upload a valid photo ID to complete your booking. No 3D field
                  will be placed.
                </p>
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
