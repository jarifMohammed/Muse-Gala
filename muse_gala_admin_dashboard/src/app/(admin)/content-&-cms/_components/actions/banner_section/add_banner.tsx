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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Types
type Banner = {
  _id: string
  title: string
  image: { filename: string; url: string }[]
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
}

// -------------------- ADD HOOK --------------------
function useAddBanner() {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/banner`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      )

      if (!res.ok) {
        throw new Error('Failed to create banner')
      }

      return res.json()
    },
  })
}

// -------------------- EDIT HOOK --------------------
function useEditBanner(bannerId: string) {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/banner/${bannerId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      )

      if (!res.ok) {
        throw new Error('Failed to update banner')
      }

      return res.json()
    },
  })
}

// -------------------- GET SINGLE BANNER --------------------
function useGetBanner(bannerId: string, enabled: boolean) {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useQuery({
    queryKey: ['banner', bannerId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/banner/${bannerId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to fetch banner')
      }

      const json = await res.json()
      return json.data as Banner
    },
    enabled,
  })
}

// -------------------- ADD COMPONENT --------------------
export const BannerAdd = () => {
  const [status, setStatus] = useState('active')
  const addBanner = useAddBanner()
  const queryClient = useQueryClient()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('status', status)

    addBanner.mutate(formData, {
      onSuccess: () => {
        toast.success('Banner added successfully')
        queryClient.invalidateQueries({ queryKey: ['banners'] })
        ;(e.target as HTMLFormElement).reset()
        setStatus('active')
      },
      onError: () => {
        toast.error('Failed to add banner')
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{'Add Banner'}</Button>
      </DialogTrigger>

      <DialogContent className="p-8 max-w-2xl font-sans ">
        <DialogHeader>
          <div className="flex justify-center my-8">
            <Image src={'/logo.png'} alt="modal-Alert" width={70} height={60} />
          </div>
          <DialogTitle className="text-3xl tracking-wide font-light py-6">
            Add Banner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter banner title"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Banner Image (JPEG/PNG, Max 20MB)</Label>
            <Input
              id="image"
              name="filename"
              type="file"
              accept="image/*"
              required
            />
          </div>

          {/* Status Dropdown */}
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

          <DialogFooter>
            <Button type="submit" disabled={addBanner.isPending}>
              {addBanner.isPending ? 'Saving...' : 'Save Banner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// -------------------- EDIT COMPONENT --------------------
export const BannerEdit = ({
  bannerId,
  children,
}: {
  bannerId: string
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<string>('active')
  const [isInitialized, setIsInitialized] = useState(false)

  const editBanner = useEditBanner(bannerId)
  const queryClient = useQueryClient()

  const { data: bannerData, isLoading } = useGetBanner(bannerId, open)

  useEffect(() => {
    if (bannerData && !isInitialized) {
      setStatus(bannerData.status)
      setIsInitialized(true)
    }
  }, [bannerData, isInitialized])

  useEffect(() => {
    if (!open) setIsInitialized(false)
  }, [open])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('status', status)

    editBanner.mutate(formData, {
      onSuccess: () => {
        toast.success('Banner updated successfully')
        queryClient.invalidateQueries({ queryKey: ['banners'] })
        setOpen(false)
      },
      onError: () => {
        toast.error('Failed to update banner')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="p-8 max-w-2xl font-sans overflow-y-auto max-h-[90vh] scroll-smooth ">
        <DialogHeader>
          <div className="flex justify-center my-8">
            <Image src={'/logo.png'} alt="modal-Alert" width={70} height={60} />
          </div>
          <DialogTitle className="text-3xl tracking-wide font-light py-6">
            Edit Banner
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : bannerData ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={bannerData.title}
                required
              />
            </div>

            {/* Current Image */}
            {bannerData.image && bannerData.image.length > 0 && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="flex justify-start">
                  <Image
                    src={bannerData.image[0].url}
                    alt={bannerData.title}
                    width={899}
                    height={480}
                    className="rounded-md border object-cover"
                  />
                </div>
              </div>
            )}

            {/* Replace Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Replace Image (optional)</Label>
              <Input id="image" name="filename" type="file" accept="image/*" />
            </div>

            {/* Status Dropdown */}
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

            <DialogFooter>
              <Button type="submit" disabled={editBanner.isPending}>
                {editBanner.isPending ? 'Updating...' : 'Update Banner'}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
