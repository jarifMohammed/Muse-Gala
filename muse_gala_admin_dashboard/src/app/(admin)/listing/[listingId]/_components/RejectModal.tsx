'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export default function RejectModal({ open, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reason for Rejection</h2>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide reason for rejection..."
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(reason)}>Reject</Button>
        </div>
      </div>
    </div>
  )
}
