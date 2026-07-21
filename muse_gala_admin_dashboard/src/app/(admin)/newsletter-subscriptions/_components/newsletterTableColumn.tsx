'use client'

import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

export interface NewsletterSubscription {
    _id: string
    email: string
    subscribedAt: string
    status?: string
}

export const newsletterTableColumns: ColumnDef<NewsletterSubscription>[] = [
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'subscribedAt',
        header: 'Subscribed At',
        cell: ({ row }) => {
            return (
                <div>{moment(row.original.subscribedAt).format('D MMM YYYY hh:mm A')}</div>
            )
        },
    },
]
