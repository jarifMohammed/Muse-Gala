'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

import { loginAction } from '@/actions/auth/login'
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
import { loginformSchema, LoginFormValues } from '@/schemas/auth'
// import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const [isPending, startTransition] = useTransition()
  // const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginformSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // submit handler
  async function onSubmit(values: LoginFormValues) {
    startTransition(() => {
      loginAction(values).then((res) => {
        if (!res.success) {
          toast.error(res.message || 'Login failed. Please try again.')
          return
        }

        toast.success(res.message || 'Login successful')
        // router.push('/')
        window.location.href = '/'
      })
    })
  }

  return (
    <div className="md:col-span-2 md:pr-[50px] lg:pr-[100px] flex flex-col justify-center">
      <h2 className="text-2xl md:text-[27px] font-thin lg:text-3xl text-black leading-[36px] pb-[25px] md:pb-[35px] lg:pb-[45px] text-right uppercase">
        Already part of Muse Club? Log in.
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email field */}
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

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="w-full flex justify-between items-center">
                  <FormLabel className="text-sm font-normal text-black leading-[20px] uppercase">
                    Password
                  </FormLabel>
                  <Link href="/forgot-password">
                    <button
                      className="text-base font-normal text-black leading-[20px] uppercase"
                      type="button"
                    >
                      Forgot Password?
                    </button>
                  </Link>
                </div>
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

          {/* Submit button */}
          <div className="w-full flex justify-center items-center pt-[20px]">
            <button
              className={cn(
                'text-base font-normal text-black leading-[20px] border-b border-black py-[10px] uppercase',
                isPending && 'text-black/50'
              )}
              type="submit"
            >
              {isPending ? 'Signing in' : 'Sign In'}
            </button>
          </div>
        </form>
      </Form>

      {/* Join section */}
      <h2 className="text-2xl md:text-[27px] lg:text-3xl font-thin text-black leading-[36px] pt-[25px] md:pt-[45px] lg:pt-[60px] text-right">
        NEW HERE? JOIN MUSE CLUB
      </h2>
      <div className="w-full flex justify-end items-center pt-[15px] md:pt-[22px] lg:pt-[30px]">
        <Link href="/sign-up">
          <button
            className="text-base font-thin text-black leading-[20px] border-b border-black py-[10px] uppercase"
            type="button"
          >
            JOIN THE MUSE CLUB
          </button>
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
