'use client'

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { User } from '@/zustand/useUserStore'

interface IDVerificationModalProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
}

interface GetApiRes {
    status: boolean
    message: {
        url: string
        message: string
    }
}

const IDVerificationModal = ({ isOpen, onClose, user }: IDVerificationModalProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const hasOpenedRef = useRef(false)

    const {
        data: kycRes,
        refetch: fetchKyc,
        isFetching,
    } = useQuery<GetApiRes>({
        queryKey: ['kyc-check-modal'],
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

    useEffect(() => {
        if (kycRes?.status && kycRes.message?.url && !hasOpenedRef.current) {
            hasOpenedRef.current = true
            window.open(kycRes.message.url, '_blank')
            onClose()
        }
    }, [kycRes, onClose])

    useEffect(() => {
        if (!isOpen) {
            hasOpenedRef.current = false
        }
    }, [isOpen])


    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-[425px] font-avenir">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-none opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl tracking-widest uppercase">ID Verification Required</AlertDialogTitle>
                    <AlertDialogDescription className="text-base py-4">
                        Almost there. Before you rent, we just need a quick ID verification.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel
                        onClick={onClose}
                        className="uppercase tracking-widest text-xs border-black rounded-none"
                    >
                        Close
                    </AlertDialogCancel>
                    <Button
                        onClick={() => fetchKyc()}
                        disabled={isFetching}
                        className="bg-black text-white hover:bg-black/80 uppercase tracking-widest text-xs h-10 rounded-none"
                    >
                        {isFetching ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify Now'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default IDVerificationModal
