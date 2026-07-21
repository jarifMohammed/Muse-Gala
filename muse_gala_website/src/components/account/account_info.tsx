'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, CreditCard } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { ProfileFormSchemaValues, profileSchema } from '@/schemas/account'
import { useUserStore } from '@/zustand/useUserStore'

const AccountInfo = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { user, setUser } = useUserStore()
  const queryClient = useQueryClient()

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // ✅ Fetch user info
  const {
    data: userRes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/user/${user?.id}`, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch user data')
      return res.json()
    },
    enabled: !!user?.id && !!user?.accessToken,
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const currentUser = userRes?.data || user
  console.log('current user', currentUser)

  // ✅ Form setup
  const form = useForm<ProfileFormSchemaValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  })

  // ✅ Update form values when data changes
  useEffect(() => {
    if (currentUser) {
      form.reset({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
      })
    }
  }, [currentUser, form])

  // ✅ Mutation for updating profile
  const { mutate, isPending } = useMutation({
    mutationFn: async (body: ProfileFormSchemaValues) => {
      const res = await fetch(`${baseUrl}/api/v1/user/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      return res.json()
    },
    onSuccess: async (res) => {
      setIsEditing(false)
      if (res?.data) {
        // ✅ fix: avoid `(prev:any)` type issue
        setUser({
          ...user,
          ...res.data,
        })
      }
      await queryClient.invalidateQueries({ queryKey: ['user', user?.id] })
      refetch()
    },
  })

  const onSubmit = (values: ProfileFormSchemaValues) => mutate(values)

  // ✅ Mutation for updating payment method
  const { mutate: updatePaymentMethod, isPending: isPaymentPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/payment/savePaymentInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
      if (!res.ok) throw new Error('Failed to create payment session')
      return res.json()
    },
    onSuccess: (data) => {
      if (data?.data?.url) {
        window.location.href = data.data.url
      } else {
        toast.error('Could not redirect to payment page. Please try again.')
      }
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.')
    },
  })

  // ✅ Skeleton loader
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !currentUser) {
    return (
      <p className="text-center text-red-500 py-10">Failed to load user info</p>
    )
  }

  return (
    <section>
      <div>
        <h2 className="text-lg tracking-widest font-light mb-6 border-black border-b-[1px] pb-5">
          Account Info
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-light tracking-wide">
            {/* Left Column */}
            <div className="space-y-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-light tracking-wider">
                      First Name
                    </FormLabel>
                    {isEditing ? (
                      <FormControl>
                        <Input
                          {...field}
                          className="border-b border-gray-300 rounded-none px-2 py-1 text-sm"
                        />
                      </FormControl>
                    ) : (
                      <p className="text-base mt-1 mb-6 text-gray-700 tracking-widest">
                        {field.value || 'N/A'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-light tracking-wider">
                      Email
                    </FormLabel>
                    {isEditing ? (
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="border-b border-gray-300 rounded-none px-2 py-1 text-sm"
                        />
                      </FormControl>
                    ) : (
                      <p className="text-base tracking-wider text-gray-700 mt-1 mb-6">
                        {field.value || 'N/A'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-light tracking-wider">
                      Last Name
                    </FormLabel>
                    {isEditing ? (
                      <FormControl>
                        <Input
                          {...field}
                          className="border-b border-gray-300 rounded-none px-2 py-1 text-sm"
                        />
                      </FormControl>
                    ) : (
                      <p className="text-base tracking-wider text-gray-700 mt-1 mb-6">
                        {field.value || 'N/A'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-light tracking-wider">
                      Phone
                    </FormLabel>
                    {isEditing ? (
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          className="border-b border-gray-300 rounded-none px-2 py-1 text-sm"
                        />
                      </FormControl>
                    ) : (
                      <p className="text-base text-gray-700 tracking-wider mt-1 mb-6">
                        {field.value || 'N/A'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            {isEditing ? (
              <div className="flex gap-x-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="text-xs rounded-none border border-gray-300 hover:bg-transparent hover:text-black font-light tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="text-xs rounded-none border border-gray-300 hover:bg-transparent hover:text-black font-light tracking-wider"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    'Save Now'
                  )}
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-base border-b border-black pb-1 hover:text-black font-light tracking-wider"
              >
                Edit Info
              </button>
            )}
          </div>
        </form>
      </Form>

      {/* ── Update Payment Method ── */}
      <div className="mt-10 border-t border-black/10 pt-8">
        <h2 className="text-lg tracking-widest font-light mb-2">
          Payment Method
        </h2>
        <p className="text-sm text-gray-500 font-light tracking-wide mb-5">
          Add or update the card used for your bookings. You will be securely redirected to Stripe.
        </p>
        <Button
          type="button"
          id="update-payment-method-btn"
          onClick={() => updatePaymentMethod()}
          disabled={isPaymentPending}
          className="flex items-center gap-2 rounded-none border border-black bg-transparent text-black hover:bg-black hover:text-white text-xs font-light tracking-widest transition-all duration-300 px-6 py-4"
        >
          {isPaymentPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          Update Payment Method
        </Button>
      </div>
    </section>
  )
}

export default AccountInfo
