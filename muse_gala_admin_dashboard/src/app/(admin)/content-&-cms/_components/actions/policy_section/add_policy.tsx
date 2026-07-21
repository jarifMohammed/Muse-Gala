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
import { Textarea } from '@/components/ui/textarea'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

// types
interface PolicySectionEditProps {
  id: string
  children: React.ReactNode
}

// ---------------- ADD POLICY ----------------
function useAddPolicy() {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useMutation({
    mutationFn: async (payload: {
      name: string
      details: string
      status: string
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/termsAndConditions`,
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
        throw new Error(errorData?.message || 'Failed to create policy')
      }

      return res.json()
    },
  })
}

export const PolicySectionAdd = () => {
  const [status, setStatus] = useState('active')
  const addPolicy = useAddPolicy()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      name: formData.get('name') as string,
      details: formData.get('details') as string,
      status,
    }

    addPolicy.mutate(payload, {
      onSuccess: () => {
        toast.success('Policy created successfully!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create policy!')
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'}>{'Add Policy'}</Button>
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
            Add Policy
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="policyName">Policy Name</Label>
            <Input
              id="policyName"
              name="name"
              placeholder="Enter policy name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              name="details"
              placeholder="Enter policy details"
              required
            />
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
            <Button disabled={addPolicy.isPending} type="submit">
              {addPolicy.isPending ? 'Saving...' : 'Save Policy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- EDIT POLICY ----------------
function useGetPolicy(id: string) {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/termsAndConditions/${id}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch policy')
      const json = await res.json()
      return json.data
    },
  })
}

function useEditPolicy(id: string) {
  const session = useSession()
  const accessToken = session?.data?.user.accessToken

  return useMutation({
    mutationFn: async (payload: {
      name: string
      details: string
      status: string
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/termsAndConditions/${id}`,
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
        throw new Error(errorData?.message || 'Failed to update policy')
      }
      return res.json()
    },
  })
}

export const PolicySectionEdit = ({ id, children }: PolicySectionEditProps) => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('active')
  const [initialized, setInitialized] = useState(false)

  const { data: policyData, isLoading } = useGetPolicy(id)
  const editPolicy = useEditPolicy(id)

  useEffect(() => {
    if (policyData && !initialized) {
      setStatus(policyData.status)
      setInitialized(true)
    }
  }, [policyData, initialized])

  useEffect(() => {
    if (!open) setInitialized(false)
  }, [open])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      name: formData.get('name') as string,
      details: formData.get('details') as string,
      status,
    }

    editPolicy.mutate(payload, {
      onSuccess: () => {
        toast.success('Policy updated successfully!')
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update policy!')
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
            Edit Policy
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : policyData ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name">Policy Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={policyData.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                name="details"
                defaultValue={policyData.details}
                required
              />
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

            <p>Editing policy with id: {id}</p>

            <DialogFooter className="pt-10">
              <Button disabled={editPolicy.isPending} type="submit">
                {editPolicy.isPending ? 'Updating...' : 'Update Policy'}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
