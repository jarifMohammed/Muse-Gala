'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon, Loader2 } from 'lucide-react'
import { User } from '@/zustand/useUserStore'

interface GetApiRes {
  status: boolean
  message: {
    url: string
    message: string
  }
}

interface UserResponse {
  status: boolean
  message: string
  data: {
    kycVerified?: boolean
  }
}

interface DocumentVerificationProps {
  user: User | null
}

const DocumentVerification = ({ user }: DocumentVerificationProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const {
    data: kycRes,
    refetch: fetchKyc,
    isFetching,
  } = useQuery<GetApiRes>({
    queryKey: ['kyc-check'],
    queryFn: async () => {
      const currentPath = window.location.pathname;
      const res = await fetch(`${baseUrl}/api/v1/user/kyc/verify?returnUrl=${encodeURIComponent(currentPath)}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
      if (!res.ok) throw new Error('ID verification failed')
      return res.json()
    },
    enabled: false,
  })

  const {
    data: userRes,
    isLoading,
    isError,
    error,
  } = useQuery<UserResponse>({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
      if (!res.ok) throw new Error('Failed to fetch user data')
      return res.json()
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (kycRes?.status && kycRes.message?.url) {
      window.open(kycRes.message.url, '_blank')
    }
  }, [kycRes])

  if (!user) return null
  if (isLoading) return null
  if (isError) return <p className="text-red-500">{(error as Error).message}</p>

  if (userRes && !userRes.data?.kycVerified) {
    return (
      <Alert
        variant="destructive"
        className="flex items-center justify-between"
      >
        <div className="flex items-start gap-x-2">
          <AlertCircleIcon className="w-5 h-5 mt-0.5" />
          <div>
            <AlertTitle>ID verification required</AlertTitle>
            <AlertDescription>
              Almost there. Before you rent, we just need a quick ID verification.
            </AlertDescription>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => fetchKyc()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Verifying...
            </>
          ) : (
            'Verify Now'
          )}
        </Button>
      </Alert>
    )
  }

  return null
}

export default DocumentVerification
