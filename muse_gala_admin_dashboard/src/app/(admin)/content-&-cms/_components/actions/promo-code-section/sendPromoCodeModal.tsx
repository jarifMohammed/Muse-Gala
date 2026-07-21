/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== FILE: _components/SendPromoModal.tsx ====================
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  useGetAllUsers,
  useSendPromoToAll,
  useSendPromoToSelected,
} from '@/lib/promo'
import { useSession } from 'next-auth/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

interface SendPromoModalProps {
  promoId: string
  promoCode: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendPromoModal({
  promoId,
  promoCode,
  open,
  onOpenChange,
}: SendPromoModalProps) {
  const session = useSession()
  const accessToken = session?.data?.user?.accessToken || ''

  const [sendType, setSendType] = useState<'all' | 'selected'>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const { data: usersData, isLoading: loadingUsers } =
    useGetAllUsers(accessToken)
  const sendToAll = useSendPromoToAll(promoId, accessToken)
  const sendToSelected = useSendPromoToSelected(promoId, accessToken)

  const users = usersData?.users || []
  // console.log('users for promo sending', users)

  const filteredUsers = users?.filter((user: any) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    )
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u: any) => u._id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const handleSend = () => {
    if (sendType === 'all') {
      sendToAll.mutate(undefined, {
        onSuccess: () => {
          toast.success('Promo code sent to all users!')
          onOpenChange(false)
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to send promo code')
        },
      })
    } else {
      if (selectedUsers.length === 0) {
        toast.error('Please select at least one user')
        return
      }
      sendToSelected.mutate(selectedUsers, {
        onSuccess: () => {
          toast.success(`Promo code sent to ${selectedUsers.length} users!`)
          onOpenChange(false)
          setSelectedUsers([])
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to send promo code')
        },
      })
    }
  }

  const isPending = sendToAll.isPending || sendToSelected.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl mb-10 font-light tracking-widest">
            Send Promo Code:{' '}
            <span className="font-medium tracking-widest font-sans text-blue-600">
              {promoCode}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Send Type Selection */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant={sendType === 'all' ? 'secondary' : 'outline'}
              onClick={() => setSendType('all')}
              className="flex-1"
            >
              Send to All Users
            </Button>
            <Button
              type="button"
              variant={sendType === 'selected' ? 'secondary' : 'outline'}
              onClick={() => setSendType('selected')}
              className="flex-1"
            >
              Send to Selected Users
            </Button>
          </div>

          {/* Selected Users Section */}
          {sendType === 'selected' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value.toLowerCase())}
                  className="max-w-xs"
                />
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
              </div>

              {loadingUsers ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                  <div className="sticky top-0 bg-gray-50 border-b p-3 flex items-center gap-2">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="font-medium text-sm">Select All</span>
                  </div>

                  <div className="divide-y">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user: any) => (
                        <div
                          key={user._id}
                          className="p-3 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Checkbox
                            checked={selectedUsers.includes(user._id)}
                            onCheckedChange={checked =>
                              handleSelectUser(user._id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Send Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isPending}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              {isPending ? 'Sending...' : 'Send Promo Code'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
