'use client'

import { useState, ChangeEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Paperclip, Loader2 } from 'lucide-react'

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
    if (!disabled) {
      inputRef?.current?.focus()
    }
  }, [disabled, message])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center gap-2">
        {/* File Upload */}
        <label
          className={`cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            disabled={disabled}
          />
        </label>

        {/* Message Input */}
        <input
          ref={inputRef}
          placeholder={file ? `Attached: ${file.name}` : 'Type your message...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="rounded-full py-4 px-5 border w-full outline-none bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />

        {/* Send Button */}
        <Button
          type="button"
          onClick={handleSend}
          size="icon"
          disabled={disabled || (!message.trim() && !file)}
          className="rounded-full bg-black hover:bg-gray-800 p-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Send className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>

      {/* File preview */}
      {file && (
        <div className="mt-2 text-xs text-gray-500">
          Attached: {file.name}
          <button
            onClick={() => setFile(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
