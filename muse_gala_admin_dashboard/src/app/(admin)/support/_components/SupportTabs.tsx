import SupportTable, { Ticket } from './supportTable'
import { AnimatedTabs } from '@/components/ui/animated-tabs'

interface SupportTabsProps {
  tickets: Ticket[]
}

export default function SupportTabs({ tickets }: SupportTabsProps) {
  const lenderTickets = tickets.filter((t) => t.lender)
  const otherTickets = tickets.filter((t) => !t.lender)

  return (
    <AnimatedTabs
      tabs={[
        {
          id: 'all',
          label: 'All',
          content: <SupportTable initialData={tickets} />,
        },
        {
          id: 'lender',
          label: 'Lender Messages',
          content: <SupportTable initialData={lenderTickets} />,
        },
        {
          id: 'other',
          label: 'Other',
          content: <SupportTable initialData={otherTickets} />,
        },
      ]}
      defaultTab="all"
    />
  )
}
