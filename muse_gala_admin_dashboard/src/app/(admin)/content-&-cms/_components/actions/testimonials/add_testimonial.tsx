'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

// ---------------- ADD TESTIMONIAL ----------------
function useAddTestimonial() {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useMutation({
    mutationFn: async (payload: {
      customerName: string
      content: string
      rating: string
      status: string
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/testimonoal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData?.message || 'Failed to create testimonial')
      }

      return res.json()
    },
  })
}

export const TestimonialSectionAdd = () => {
  const [status, setStatus] = useState('active')
  const [rating, setRating] = useState('5')
  const add = useAddTestimonial()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      customerName: formData.get('customerName') as string,
      content: formData.get('content') as string,
      rating,
      status,
    }

    add.mutate(payload, {
      onSuccess: () => {
        toast.success('Testimonial created successfully!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create testimonial!')
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{'Add Testimonial'}</Button>
      </DialogTrigger>

      <DialogContent className="p-8">
        <DialogHeader>
          <div className="flex justify-center my-8">
            <Image
              src={'/logo.png'}
              alt="modal-Alert"
              width={70}
              height={60}
              className="object-cover"
            />
          </div>
          <DialogTitle className="text-3xl tracking-wide font-light py-6">
            Add Testimonial
          </DialogTitle>
        </DialogHeader>

        {/* FORM START */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName" className="tracking-wide font-light">
              Customer Name
            </Label>
            <Input
              id="customerName"
              name="customerName"
              placeholder="Enter customer name"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="tracking-wide font-light">
              Content
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter testimonial content"
              required
            />
          </div>

          {/* Rating Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="tracking-wide font-light">
              Rating
            </Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="status" className="tracking-wide font-light">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-10">
            <Button disabled={add.isPending} type="submit">
              {add.isPending ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- EDIT TESTIMONIAL ----------------
function useGetTestimonial(id: string) {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useQuery({
    queryKey: ['testimonial', id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/testimonoal/${id}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch testimonial')
      const json = await res.json()
      return json.data
    },
  })
}

function useEditTestimonial(id: string) {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useMutation({
    mutationFn: async (payload: {
      customerName: string
      content: string
      rating: string
      status: string
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/testimonoal/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData?.message || 'Failed to update testimonial')
      }
      return res.json()
    },
  })
}

interface TestimonialSectionEditProps {
  id: string
  children: React.ReactNode
}

export const TestimonialSectionEdit = ({
  id,
  children,
}: TestimonialSectionEditProps) => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('active')
  const [rating, setRating] = useState('5')
  const [initialized, setInitialized] = useState(false)

  const { data: testimonial, isLoading } = useGetTestimonial(id)
  const editTestimonial = useEditTestimonial(id)

  useEffect(() => {
    if (testimonial && !initialized) {
      setStatus(testimonial.status)
      setRating(testimonial.rating)
      setInitialized(true)
    }
  }, [testimonial, initialized])

  useEffect(() => {
    if (!open) setInitialized(false)
  }, [open])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      customerName: formData.get('customerName') as string,
      content: formData.get('content') as string,
      rating,
      status,
    }

    editTestimonial.mutate(payload, {
      onSuccess: () => {
        toast.success('Testimonial updated successfully!')
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update testimonial!')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="p-8">
        <DialogHeader>
          <div className="flex justify-center my-8">
            <Image
              src="/logo.png"
              alt="modal-Alert"
              width={70}
              height={60}
              className="object-cover"
            />
          </div>
          <DialogTitle className="text-3xl tracking-wide font-light py-6">
            Edit Testimonial
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : testimonial ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                defaultValue={testimonial.customerName}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={testimonial.content}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-10">
              <Button disabled={editTestimonial.isPending} type="submit">
                {editTestimonial.isPending
                  ? 'Updating...'
                  : 'Update Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
