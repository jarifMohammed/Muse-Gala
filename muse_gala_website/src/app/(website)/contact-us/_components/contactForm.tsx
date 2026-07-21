'use client'

import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'

type FormValues = {
  name: string
  email: string
  message: string
}

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/support/general`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
          }),
        }
      )

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: result.message || 'Your message has been sent successfully!',
        })
        form.reset()
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to send message. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center md:col-span-2 md:pr-[50px] lg:pr-[100px]">
      <h2 className="text-2xl md:text-[27px] uppercase lg:text-3xl font-light tracking-[.1em] text-gray-700 leading-[36px] pb-[25px] md:pb-[35px] lg:pb-[45px] text-right">
        Contact Us
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 md:space-y-7"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[14px] font-avenir font-thin tracking-[.1em] text-black leading-[20px] uppercase">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                  />
                </FormControl>
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
                <FormLabel className="text-sm font-thin tracking-[.1em] text-black leading-[20px] uppercase">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-thin tracking-[.1em] text-black leading-[20px] uppercase">
                  How can we help
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none resize-none outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <div className="w-full flex justify-center items-center pt-5">
            <button
              className={cn(
                'text-sm font-normal tracking-[.1em] disabled:text-black/90 text-black leading-[20px] border-b border-black py-[10px] uppercase flex items-center gap-x-3 bg-transparent',
                isLoading && 'opacity-50'
              )}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Please wait <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ContactForm
