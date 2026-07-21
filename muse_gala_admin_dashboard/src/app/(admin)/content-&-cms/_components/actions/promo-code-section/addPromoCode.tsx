/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== FILE: _components/AddPromoCode.tsx ====================
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
import { useState } from 'react'
import { toast } from 'sonner'
import { useCreatePromo } from '@/lib/promo'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export function AddPromoCode() {
  const session = useSession()
  const accessToken = session?.data?.user?.accessToken || ''

  const [open, setOpen] = useState(false)
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>(
    'PERCENTAGE',
  )

  const createPromo = useCreatePromo(accessToken)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      code: formData.get('code') as string,
      discountType,
      discount: Number(formData.get('discount')),
      expiresAt: new Date(formData.get('expiresAt') as string).toISOString(),
      maxUsage: Number(formData.get('maxUsage')),
    }

    createPromo.mutate(payload, {
      onSuccess: () => {
        toast.success('Promo code created successfully!')
        setOpen(false)
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create promo code')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Code</Button>
      </DialogTrigger>

      <DialogContent className="p-8 max-w-md font-sans">
        <DialogHeader>
          <div className="flex justify-center my-4">
            <Image
              src="/logo.png"
              alt="logo"
              width={70}
              height={60}
              className="object-cover"
            />
          </div>
          <DialogTitle className="text-2xl font-light text-center">
            Add Referral
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code (5-19 Chars, Alphanumeric)</Label>
            <Input
              id="code"
              name="code"
              placeholder="Enter promo code"
              required
              minLength={5}
              maxLength={19}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Select
              value={discountType}
              onValueChange={val => setDiscountType(val as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                <SelectItem value="FLAT">Flat Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              placeholder={discountType === 'PERCENTAGE' ? '20' : '200'}
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              className="text-gray-400"
              disabled
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiry Date</Label>
            <Input
              id="expiresAt"
              name="expiresAt"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUsage">Usage Count</Label>
            <Input
              id="maxUsage"
              name="maxUsage"
              type="number"
              placeholder="100"
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select defaultValue="active" disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={createPromo.isPending}
              className="w-full bg-black hover:bg-gray-800"
            >
              {createPromo.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
