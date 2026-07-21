'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import Image from 'next/image'
import { Ticket } from './supportTable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// ---- PATCH API ----
// Integrate new PATCH API route for updating status
async function updateSupportTicket(
  id: string,
  accessToken: string,
  payload: { status: string }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/support/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) throw new Error('Failed to update ticket')
  return res.json()
}

export function SupportDetailsPopup({
  id,
  children,
  data,
}: {
  id: string
  children: React.ReactNode
  data: Ticket & { file?: string | string[] }
}) {
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''
  const queryClient = useQueryClient()

  const [status, setStatus] = useState(data.status)
  // Removed priority state
  // Removed response state

  // --- useMutation ---
  const mutation = useMutation({
    mutationFn: (payload: { status: string }) => updateSupportTicket(id, accessToken, payload),
    onSuccess: () => {
      // cache refresh
      queryClient.invalidateQueries({
        queryKey: ['support-stats', accessToken],
      })
      queryClient.invalidateQueries({ queryKey: ['support-ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets', accessToken] })

      toast.success(' Ticket updated successfully!')
    },
    onError: () => {
      toast.error(' Failed to update ticket')
    },
  })

  const handleSave = () => {
    mutation.mutate({ status: status.toLowerCase() })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto p-3 py-8 space-y-4 font-sans">
        {/* Header */}
        <DialogHeader>
          <div className="flex justify-center mb-7 mt-6">
            <Image
              src="/logo.svg"
              alt="Support Ticket"
              width={100}
              height={100}
              priority
              className="object-contain"
              quality={100}
            />
          </div>
        </DialogHeader>

        {/* Ticket Summary (priority removed) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light tracking-wider">
              Ticket Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 font-light tracking-wider">
            <p>
              <strong className="font-medium">Ticket ID:</strong> {id}
            </p>
            {/* Extracted user/lender/guest info */}
            {(() => {
              if (data?.user) {
                return (
                  <>
                    <p>
                      <strong className="font-medium">User ID:</strong>{' '}
                      {data.user._id}
                    </p>
                    <p>
                      <strong className="font-medium">Email:</strong>{' '}
                      {data.user.email}
                    </p>
                    {typeof data.user === 'object' && 'name' in data.user && data.user.name ? (
                      <p>
                        <strong className="font-medium">Name:</strong>{' '}
                        {data.user.name}
                      </p>
                    ) : null}
                  </>
                )
              } else if (data?.lender) {
                return (
                  <>
                    <p>
                      <strong className="font-medium">Lender ID:</strong>{' '}
                      {data.lender._id}
                    </p>
                    <p>
                      <strong className="font-medium">Email:</strong>{' '}
                      {data.lender.email}
                    </p>
                    {typeof data.lender === 'object' && 'name' in data.lender && data.lender.name ? (
                      <p>
                        <strong className="font-medium">Name:</strong>{' '}
                        {typeof data.lender.name === 'string' ? data.lender.name : JSON.stringify(data.lender.name)}
                      </p>
                    ) : null}
                  </>
                )
              } else {
                return (
                  <>
                    <p>
                      <strong className="font-medium">User:</strong> Guest
                    </p>
                    {data.name && (
                      <p>
                        <strong className="font-medium">Name:</strong>{' '}
                        {data.name}
                      </p>
                    )}
                    {typeof data.email === 'string' && (
                      <p>
                        <strong className="font-medium">Email:</strong>{' '}
                        {data.email}
                      </p>
                    )}
                  </>
                )
              }
            })()}
            <p>
              <strong className="font-medium">Issue Type:</strong>{' '}
              {data?.issueType || 'N/A'}
            </p>
            <p>
              <strong className="font-medium">Status:</strong> {status}
            </p>
            <p>
              <strong className="font-medium">Created Date:</strong>{' '}
              {new Date(data?.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
            <p>
              <strong className="font-medium">Description:</strong>{' '}
              {data?.message || 'N/A'}
            </p>
            {/* File Preview Section */}
            {data?.file && (
              <div className="mt-4">
                <strong className="font-medium">Attachment:</strong>
                {(Array.isArray(data.file) ? data.file : [data.file]).map((fileUrl, idx) => (
                  <a
                    key={fileUrl + idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border rounded p-1 mt-2 hover:shadow"
                    style={{ display: 'inline-block', marginRight: 8 }}
                  >
                    <div className="relative h-32 w-full max-w-xs">
                      <Image
                        src={fileUrl}
                        alt={`attachment-${idx}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Communication section removed */}

        {/* Update Actions (priority field removed) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as 'pending' | 'in-progress' | 'resolved')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>

          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
