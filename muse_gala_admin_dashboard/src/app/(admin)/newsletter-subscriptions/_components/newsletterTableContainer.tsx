'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NewsletterSubscription, newsletterTableColumns } from './newsletterTableColumn'
import SkeletonLoader from '@/components/loader/SkeletonLoader'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { PaginationControls } from '@/components/ui/pagination-controls'

interface NewsletterTableContainerProps {
    accessToken: string
}

interface NewsletterListResponse {
    success: boolean
    message: string
    data: NewsletterSubscription[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
}

export default function NewsletterTableContainer({
    accessToken,
}: NewsletterTableContainerProps) {
    const [page, setPage] = useState(1)

    const fetchSubscriptions = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/newsletterSubscription/get-all-newsletter-subscriptions?page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        const res: NewsletterListResponse = await response.json()

        if (!res.success) throw new Error('Failed to fetch subscriptions')

        return {
            subscriptions: res.data || [],
            pagination: res.data ? res.pagination : null,
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['newsletter-subscriptions', page],
        queryFn: fetchSubscriptions,
    })

    // Table Setup
    const table = useReactTable({
        data: data?.subscriptions || [],
        columns: newsletterTableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    if (isLoading) return <SkeletonLoader />

    if (error)
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-600">{(error as Error).message}</div>
            </div>
        )

    return (
        <Card className="pb-5">
            <div className="bg-white">
                <DataTable table={table} columns={newsletterTableColumns} />
            </div>

            {/* Pagination */}
            {data?.pagination && (
                <div className="mt-4 w-full flex justify-end">
                    <PaginationControls
                        itemsPerPage={10}
                        currentPage={data.pagination.currentPage}
                        totalPages={data.pagination.totalPages}
                        totalItems={data.pagination.totalItems}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            )}
        </Card>
    )
}
