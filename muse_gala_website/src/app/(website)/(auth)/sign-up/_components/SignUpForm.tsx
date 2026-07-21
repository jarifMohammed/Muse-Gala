'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signUpSchema, SignUpValues } from '@/schemas/auth'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


const SignUpForm = () => {
  const router = useRouter()
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (values: SignUpValues) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.status) {
        toast.error(data.message || 'Sign up failed')
        return
      }
      toast.success(data.message || 'Sign up successful')
      router.push('/login')
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: SignUpValues) {
    mutate(values)
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px] md:gap-[40px] lg:gap-[60px] px-5 md:px-0">
        {/* left side image part  */}
        <div className="md:col-span-3">
          <Image
            src="/pages/signUp.webp"
            alt="sign-up"
            width={1000}
            height={1000}
            className="w-full h-[500px] md:h-[794px] object-cover"
          />
        </div>
        {/* form part  */}
        <div className="md:col-span-2 md:pr-[50px] lg:pr-[100px] md:pt-[150px] lg:pt-[200px]">
          <h2 className="text-2xl md:text-[27px] lg:text-3xl font-normal text-black leading-[36px] pb-[25px] md:pb-[35px] lg:pb-[45px] text-right">
            NEW HERE? JOIN MUSE CLUB
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[14px] font-avenir font-normal text-black leading-[20px] uppercase">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-black leading-[20px] uppercase">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-black leading-[20px] uppercase">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                          className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-black leading-[20px] uppercase">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder=""
                          {...field}
                          className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex justify-center items-center pt-5">
                <button
                  disabled={isPending}
                  className={cn(
                    'text-sm font-normal disabled:text-black/60 text-black leading-[20px] border-b border-black py-[10px] uppercase flex items-center gap-x-3 bg-transparent',
                    isPending && 'opacity-50'
                  )}
                  type="submit"
                >
                  {isPending ? (
                    <>
                      Please wait <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    'Join Now'
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
