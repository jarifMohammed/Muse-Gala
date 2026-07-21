/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Input } from '@/components/ui/input'
import React, { useEffect } from 'react'
import { useSettingStore } from './states/useSettingStore'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

type UserInfo = {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
}

const ContactInformation = ({
  userInfo = {} as UserInfo,
  token,
  userID,
}: {
  userInfo?: UserInfo
  token: string
  userID: string
}) => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
  } = useSettingStore()

  useEffect(() => {
    if (userInfo?.firstName) setFirstName(userInfo?.firstName)
    if (userInfo?.lastName) setLastName(userInfo?.lastName)
    if (userInfo?.phoneNumber) setPhoneNumber(userInfo?.phoneNumber)
  }, [userInfo, setFirstName, setLastName, setPhoneNumber])

  const updateUserInfo = useMutation({
    mutationKey: ['update-user-info'],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${userID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phoneNumber,
          }),
        },
      )

      if (!res.ok) {
        throw new Error('Failed to update user info')
      }

      return res.json()
    },
    onSuccess: data => {
      toast.success(data.message)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserInfo.mutate()
  }

  return (
    <div className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg">
      <h1 className="text-xl ">Contact Information</h1>

      <form onSubmit={handleSubmit}>
        <div className="mt-5 grid grid-cols-2 items-center gap-8">
          <div>
            <h1 className="mb-2">First Name</h1>
            <Input
              className="focus-visible:ring-0"
              placeholder="Enter Full Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <h1 className="mb-2">Last Name</h1>
            <Input
              className="focus-visible:ring-0"
              placeholder="Enter Full Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>

          <div>
            <h1 className="mb-2">Email</h1>
            <Input
              disabled
              className="focus-visible:ring-0"
              placeholder="Enter Email Address"
              value={userInfo?.email}
            />
          </div>

          <div>
            <h1 className="mb-2">Phone Number</h1>
            <Input
              className="focus-visible:ring-0"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            disabled={updateUserInfo.isPending}
            type="submit"
            className="disabled:cursor-not-allowed"
          >
            {updateUserInfo.isPending ? (
              <h1 className="flex items-center gap-2">
                <LoaderCircle className="animate-spin h-6 w-6" />
                Save Changes
              </h1>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ContactInformation
