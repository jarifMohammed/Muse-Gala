/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

type AdminTeamSectionProps = {
  mode: 'add' | 'edit'
  adminId?: string
  onSuccess?: () => void
}

const PERMISSIONS = [
  'All Access',
  'Settings',
  'Listings Management',
  'Lenders Management',
  'Customers Management',
  'Bookings Management',
  'Disputes Management',
  'Finance Management',
  'Analytic Management',
  'Chat Management',
  'Content Management',
  'Support Management',
  'Team Management',
]

export const AdminTeamSection = ({
  mode,
  adminId,
  onSuccess,
}: AdminTeamSectionProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('Active')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  // Fetch admin details in edit mode
  const { data: adminData } = useQuery({
    queryKey: ['admin', adminId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/team/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      if (!response.ok) {
        throw new Error('Failed to fetch admin details')
      }
      const data = await response.json()
      return data.data
    },
    enabled: mode === 'edit' && !!adminId && open && !!accessToken,
  })

  // Populate form when admin data is loaded
  useEffect(() => {
    if (adminData && mode === 'edit') {
      setName(adminData.name || '')
      setEmail(adminData.email || '')
      setStatus(adminData.status || 'Active')
      setSelectedPermissions(adminData.permissions || [])
    }
  }, [adminData, mode])

  // Create admin mutation
  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/team/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create admin')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Admin created successfully')
      setOpen(false)
      resetForm()
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create admin')
    },
  })

  // Update permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: async ({
      adminId,
      permissions,
    }: {
      adminId: string
      permissions: string[]
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/team/${adminId}/permissions`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permissions }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update permissions')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Permissions updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update permissions')
    },
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      adminId,
      status,
    }: {
      adminId: string
      status: string
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/team/${adminId}/permissions`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update status')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status')
    },
  })

  // Update name mutation
  const updateNameMutation = useMutation({
    mutationFn: async ({
      adminId,
      name,
    }: {
      adminId: string
      name: string
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/team/${adminId}/permissions`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update name')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Name updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update name')
    },
  })

  const resetForm = () => {
    setName('')
    setEmail('')
    setStatus('Active')
    setSelectedPermissions([])
  }

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission],
    )
  }

  const handleSubmit = async () => {
    // Check if access token exists
    if (!accessToken) {
      toast.error('Authentication required. Please log in again.')
      return
    }

    if (mode === 'add') {
      // Validate required fields
      if (!name || !email || selectedPermissions.length === 0) {
        toast.error('Please fill all required fields')
        return
      }

      // Create new admin
      createMutation.mutate({
        name,
        email,
        permissions: selectedPermissions,
      })
    } else if (mode === 'edit' && adminId) {
      // Update admin - we need to update multiple fields
      const promises = []

      // Update name if changed
      if (name !== adminData?.name) {
        promises.push(updateNameMutation.mutateAsync({ adminId, name }))
      }

      // Update permissions if changed
      if (
        JSON.stringify(selectedPermissions) !==
        JSON.stringify(adminData?.permissions)
      ) {
        promises.push(
          updatePermissionsMutation.mutateAsync({
            adminId,
            permissions: selectedPermissions,
          }),
        )
      }

      // Update status if changed
      if (status !== adminData?.status) {
        promises.push(updateStatusMutation.mutateAsync({ adminId, status }))
      }

      if (promises.length === 0) {
        toast.info('No changes to update')
        return
      }

      try {
        await Promise.all(promises)
        setOpen(false)
        onSuccess?.()
      } catch (error) {
        // Errors are handled by individual mutations
        console.error(error)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'add' ? (
          <Button variant="default">Add Admin</Button>
        ) : (
          <button className="px-3 py-1 text-[13px] rounded-lg bg-black text-white">
            Edit
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="p-8 max-w-[40vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center my-5">
            <Image
              src={'/logo.png'}
              alt="modal-Alert"
              width={70}
              height={60}
              className="object-cover"
            />
          </div>
          <DialogTitle className="text-3xl tracking-wide font-light py-6">
            {mode === 'add' ? 'Add Admin' : 'Edit Admin'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="tracking-wide font-light">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="tracking-wide font-light">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value.toLowerCase())}
              disabled={mode === 'edit'}
              className={
                mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''
              }
            />
          </div>

          {/* Permissions Checkboxes */}
          <div className="space-y-2">
            <Label className="tracking-wide font-light">Permissions</Label>
            <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto space-y-2">
              {PERMISSIONS.map(permission => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={selectedPermissions.includes(permission)}
                    onCheckedChange={() => handlePermissionToggle(permission)}
                  />
                  <label
                    htmlFor={permission}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {permission}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Dropdown - Only in edit mode */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label htmlFor="status" className="tracking-wide font-light">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-start">
            <DialogFooter className="pt-10">
              <Button
                onClick={handleSubmit}
                disabled={
                  !accessToken ||
                  createMutation.isPending ||
                  updatePermissionsMutation.isPending ||
                  updateStatusMutation.isPending ||
                  updateNameMutation.isPending
                }
              >
                {mode === 'add'
                  ? createMutation.isPending
                    ? 'Creating...'
                    : 'Save Admin'
                  : 'Update Admin'}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
