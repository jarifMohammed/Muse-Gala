import React from 'react'
import ReturnPageClient from './_components/ReturnPageClient'

export const metadata = {
    title: 'Return Details - Muse Gala',
    description: 'View your return status and submit confirmation.',
}

export default function ReturnPage({ params }: { params: { token: string } }) {
    // Use a client component for data fetching and React contexts
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl min-h-[60vh]">
            <ReturnPageClient token={params.token} />
        </div>
    )
}
