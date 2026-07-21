'use client'
import { loginAction } from '@/actions/auth/login'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginformSchema, LoginFormValues } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import AuthHeader from './AUthHeader'
import { Checkbox } from '@/components/ui/checkbox'

export default function SignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginformSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Form submission handler
  async function onSubmit(values: LoginFormValues) {
    startTransition(() => {
      loginAction(values).then((res) => {
        // console.log(res)
        if (!res.success) {
          toast.error(res.message || 'Login failed. Please try again.')
          return
        }

        router.push('/')
        toast.success(res.message || 'Login successful')
      })
    })
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center font-sans">
      <AuthHeader />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full py-6 md:py-7 lg:py-8 px-4 md:px-5 lg:px-6 flex flex-col items-center"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full md:w-[400px]">
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                      placeholder="Enter Your Email"
                      className="w-full h-[40px] bg-transparent border-0 border-b-2 border-black text-[12px]  placeholder:text-[12px] placeholder:text-black/50 placeholder:font-normal pl-8 pr-0 rounded-none focus-visible:ring-0 focus-visible:border-b-black transition-none shadow-none"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] mt-1" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <div className="mt-8 mb-8 w-full md:w-[400px]">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Your Password"
                        className="w-full h-[40px] bg-transparent border-0 border-b-2 border-black text-[12px]  placeholder:text-[12px] placeholder:text-black/50 placeholder:font-normal pl-8 pr-12 rounded-none focus-visible:ring-0 focus-visible:border-b-black transition-none shadow-none"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-black" />
                        ) : (
                          <Eye className="h-4 w-4 text-black" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Remember Me */}
          <div className="w-full md:w-[400px] flex items-center mb-8">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="border-black data-[state=checked]:bg-black" />
              <label
                htmlFor="remember"
                className="text-[12px] text-black cursor-pointer uppercase"
              >
                REMEMBER ME
              </label>
            </div>
          </div>

          {/* Sign In Button / Arrow Sign */}
          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="group flex items-center gap-4 disabled:opacity-50"
              disabled={isPending}
            >
              <span className="text-[14px] uppercase tracking-10 text-black">
                {isPending ? 'SIGNING IN' : 'SIGN IN'}
              </span>
              <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}
