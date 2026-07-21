import { Skeleton } from '@/components/ui/custom/skeleton'
import React from 'react'

interface Props {
  title: string
  value: string
  isLoading: boolean
}

const BookingsCard = ({ title, value, isLoading }: Props) => {
  if (isLoading)
    return (
      <Skeleton className="bg-white shadow-[0px_4px_10px_0px_#0000001A] h-[150px] p-5  rounded-lg flex flex-col justify-center hover:bg-black hover:text-white cursor-pointer delay-100 transition-all">
        <Skeleton className="h-4 w-24"></Skeleton>
        <Skeleton className="h-6 w-32 mt-5"></Skeleton>
      </Skeleton>
    )

  return (
    <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] h-[150px] p-5  rounded-lg flex flex-col justify-center hover:bg-black hover:text-white cursor-pointer delay-100 transition-all font-sans text-slate-600">
      <h1>{title}</h1>
      <p className="font-medium text-2xl mt-5">{value}</p>
    </div>
  )
}

export default BookingsCard
