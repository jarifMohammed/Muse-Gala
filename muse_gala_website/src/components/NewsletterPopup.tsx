"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import Image from "next/image"
import { ArrowRight, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogPortal,
    DialogOverlay,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const newsletterSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Valid phone number is required"),
})

type NewsletterFormValues = z.infer<typeof newsletterSchema>

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem("newsletter-popup-seen")
        if (hasSeenPopup) return

        const timer = setTimeout(() => {
            setIsOpen(true)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem("newsletter-popup-seen", "true")
    }

    const form = useForm<NewsletterFormValues>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ["newsletter-subscription-popup"],
        mutationFn: async (values: NewsletterFormValues) => {
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: `+61${values.phone}`, // Australian prefix
            }
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/newsletterSubscription/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            )
            const data = await res.json()
            if (!res.ok || !data.status) {
                throw new Error(data.message || "Failed to subscribe")
            }
            return data
        },
        onSuccess: () => {
            toast.success("Thank you for subscribing")
            handleClose()
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (values: NewsletterFormValues) => {
        mutate(values)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) handleClose()
        }}>
            <DialogPortal>
                <DialogOverlay className="bg-black/40 backdrop-blur-[2px]" />
                <DialogContent className="max-w-[600px] border-none shadow-none bg-transparent p-0">
                    <div className="relative flex flex-col items-center bg-white p-8 md:p-12 w-full">
                        {/* Close Button already handled by DialogContent but we want a custom one matching style if needed */}
                        {/* The default close in dialog.tsx is fine, but lets ensure it looks good */}

                        {/* Logo */}
                        <div className="mb-8">
                            <Image src="/logo-black.svg" width={60} height={60} alt="Logo" />
                        </div>

                        {/* Content */}
                        <div className="text-center mb-10 space-y-4">
                            <h2 className="text-xl md:text-2xl  font-light tracking-[0.2em] uppercase text-gray-800">
                                A LITTLE SOMETHING FOR YOU
                            </h2>
                            <p className="text-sm md:text-base font-light text-gray-600 max-w-sm mx-auto leading-relaxed">
                                Join for exclusive offers and your welcome gift.
                            </p>
                        </div>

                        {/* Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="border-b border-black">
                                                        <Input
                                                            placeholder="FULL NAME"
                                                            className="border-none rounded-none px-0 py-2 focus-visible:ring-0 placeholder:text-gray-400 placeholder:font-light tracking-widest text-xs uppercase h-auto bg-transparent"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="border-b border-black">
                                                        <Input
                                                            placeholder="LAST NAME"
                                                            className="border-none rounded-none px-0 py-2 focus-visible:ring-0 placeholder:text-gray-400 placeholder:font-light tracking-widest text-xs uppercase h-auto bg-transparent"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="border-b border-black">
                                                    <Input
                                                        placeholder="EMAIL@EXAMPLE.COM"
                                                        className="border-none rounded-none px-0 py-2 focus-visible:ring-0 placeholder:text-gray-400 placeholder:font-light tracking-widest text-xs uppercase h-auto bg-transparent"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="border-b border-black flex items-center">
                                                    <span className="text-xs font-light tracking-widest text-gray-400 pr-2">61+</span>
                                                    <Input
                                                        placeholder="PHONE NUMBER"
                                                        className="border-none rounded-none px-0 py-2 focus-visible:ring-0 placeholder:text-gray-400 placeholder:font-light tracking-widest text-xs uppercase h-auto bg-transparent flex-1"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-6 flex justify-center">
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        className="group flex items-center gap-2 hover:bg-transparent tracking-[0.2em] font-light text-sm uppercase px-0"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <Loader2 className="animate-spin h-5 w-5" />
                                        ) : (
                                            <>
                                                UNLOCK IT
                                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
