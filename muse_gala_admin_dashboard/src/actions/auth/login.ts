'use server'

import { signIn } from '@/auth'
import { loginformSchema, LoginFormValues } from '@/schemas/auth'
import { LoginResponse } from '@/types/login'

export async function loginAction(data: LoginFormValues) {
  const { success, data: parsedData, error } = loginformSchema.safeParse(data)

  if (!success) {
    return {
      success: false,
      message: error.message,
    }
  }

  try {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/v1/auth/login'

    const res = await fetch(`${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: parsedData.email,
        password: parsedData.password,
      }),
    })

    const response: LoginResponse = await res.json()

    if (!res.ok) {
      return {
        success: false,
        message: response.message || 'Login failed',
      }
    }

    const role = response.data.user.role

    // console.log(role)

    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return {
        success: false,
        message: 'You do not have permission to access this area.',
      }
    }

    await signIn('credentials', {
      email: parsedData.email,
      password: parsedData.password,
      redirect: false,
    })

    return {
      success: true,
      message: 'Login successful',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.log(error)
    return {
      success: false,
      message: error.message ?? 'Something went wrong!',
    }
  }
}
