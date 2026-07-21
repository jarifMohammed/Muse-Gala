import { ChevronLeft, Circle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ChatHeader({
  orderId,
  dressName,
  name,
  onBack,
}: {
  orderId?: string
  dressName?: string
  name?: string
  onBack?: () => void
}) {
  return (
    <div className="sticky top-0 z-20 flex min-h-[64px] items-center justify-between border-b border-gray-100 bg-white/95 px-3 py-2.5 backdrop-blur sm:px-5 md:min-h-[72px]">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 -ml-1 text-[#54051d] md:hidden"
            onClick={onBack}
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5px]" />
          </Button>
        )}
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f7f2ee] ring-1 ring-[#54051d]/10 sm:h-11 sm:w-11">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </div>
          <span className="absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-white">
            <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
          </span>
        </div>
        <div className="min-w-0 flex flex-col">
          <p className="truncate text-sm font-semibold leading-tight text-gray-950 sm:text-base">
            {name || 'Conversation'}
          </p>
          {orderId && (
            <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wide text-gray-400">
              {dressName ? `${dressName} · ` : ''}Booking {orderId}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
