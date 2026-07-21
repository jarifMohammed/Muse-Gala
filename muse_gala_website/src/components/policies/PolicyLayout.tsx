// src/components/PolicyLayout.tsx
import React from 'react'

export default function PolicyLayout({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen container mx-auto px-8 py-12 pt-[100px] font-avenir">
      {/* Header */}
      <div className="text-center space-y-5 mb-12">
        <h1 className="text-3xl tracking-[0.35rem] mb-6 md:mb-10 uppercase font-normal text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-gray-600 text-sm md:text-base mx-auto font-light font-avenir tracking-[.1em]">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-10 text-gray-800 font-avenir leading-[30px] tracking-[.08em] font-light">
        {children}
      </div>
    </div>
  )
}
