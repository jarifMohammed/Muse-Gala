'use client'

import { useState, ChangeEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Send, X } from 'lucide-react'

interface Props {
  onSend: (text: string, file?: File) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (disabled || (!message.trim() && !file)) return

    onSend(message, file || undefined)
    setMessage('')
    setFile(null)
  }

  useEffect(() => {
    if (!disabled && window.matchMedia('(min-width: 768px)').matches) {
      inputRef.current?.focus()
    }
  }, [disabled])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="bg-white px-3 py-3 sm:px-4">
      {file && (
        <div className="mx-auto mb-2 flex max-w-4xl items-center justify-between gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600">
          <span className="min-w-0 truncate">Attached: {file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white hover:text-red-500"
            aria-label="Remove attachment"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mx-auto flex max-w-4xl items-end gap-2 sm:gap-3">
        {/* Plus / File Upload */}
        <label
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 ${disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
        >
          <Plus className="h-5 w-5" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            disabled={disabled}
          />
        </label>

        {/* Message Input Container */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            placeholder={file ? `Attached: ${file.name}` : 'Type a message...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="h-10 w-full rounded-md border-none bg-gray-100 px-4 py-2.5 pr-4 text-sm outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-[#54051d]/20 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
          />
        </div>

        {/* Send Button */}
        <Button
          type="button"
          onClick={handleSend}
          size="icon"
          disabled={disabled || (!message.trim() && !file)}
          className="h-10 w-10 shrink-0 rounded-md bg-[#54051d] text-white shadow-md shadow-[#54051d]/20 transition-all hover:bg-[#54051d]/90 active:scale-95 disabled:opacity-50"
        >
          {disabled ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-4 w-4 fill-white" />
          )}
        </Button>
      </div>
    </div>
  )
}
