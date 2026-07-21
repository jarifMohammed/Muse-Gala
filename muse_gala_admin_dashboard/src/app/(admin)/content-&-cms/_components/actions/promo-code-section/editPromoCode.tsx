/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== FILE: _components/EditPromoCode.tsx ====================
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useGetSinglePromo, useUpdatePromo } from '@/lib/promo'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface EditPromoCodeProps {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPromoCode({ id, open, onOpenChange }: EditPromoCodeProps) {
  const session = useSession()
  const accessToken = session?.data?.user?.accessToken || ''

  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>(
    'PERCENTAGE',
  )
  const [isActive, setIsActive] = useState(true)

  const { data: promoData, isLoading } = useGetSinglePromo(id, accessToken)
  const updatePromo = useUpdatePromo(id, accessToken)

  const promo = promoData?.data

  useEffect(() => {
    if (promo) {
      setDiscountType(promo.discountType)
      setIsActive(promo.isActive)
    }
  }, [promo])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      discountType,
      discount: Number(formData.get('discount')),
      expiresAt: new Date(formData.get('expiresAt') as string).toISOString(),
      maxUsage: Number(formData.get('maxUsage')),
      isActive,
    }

    updatePromo.mutate(payload, {
      onSuccess: () => {
        toast.success('Promo code updated successfully!')
        onOpenChange(false)
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update promo code')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            Edit Promo Code
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : promo ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={promo.code} disabled className="bg-gray-100" />
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
                defaultValue={promo.discount}
                required
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                disabled
                className="bg-gray-100"
                defaultValue={
                  new Date(promo.createdAt).toISOString().split('T')[0]
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date</Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                defaultValue={
                  new Date(promo.expiresAt).toISOString().split('T')[0]
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsage">Usage Count</Label>
              <Input
                id="maxUsage"
                name="maxUsage"
                type="number"
                defaultValue={promo.maxUsage}
                required
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={isActive ? 'active' : 'inactive'}
                onValueChange={val => setIsActive(val === 'active')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={updatePromo.isPending}
                className="w-full bg-black hover:bg-gray-800"
              >
                {updatePromo.isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
