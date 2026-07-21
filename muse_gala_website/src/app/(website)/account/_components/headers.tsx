import Link from 'next/link'

interface User {
  id: string
  firstName?: string
  lastName?: string
  role?: string
  email?: string
  profileImage?: string
  accessToken?: string
}

interface HeadersProps {
  setTab: (tab: string) => void
  tab: string
  user: User | null
}

const Headers = ({ setTab, tab, user }: HeadersProps) => {
  const tabs = [
    { label: 'Account Info', href: '/account' },
    { label: 'Chats', href: '/account/chats' },
    { label: 'Dispute', href: '/account/dispute' },
    { label: 'Promo Codes', href: '/account/promo-codes' },
  ]

  return (
    <div>
      <header className="flex container mx-auto flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-10 pb-2 gap-4 pt-8 md:pt-10">
        <h1 className="md:text-3xl text-xl font-light tracking-[.5rem] uppercase">
          WELCOME BACK, {user?.firstName || 'Guest'}
        </h1>

        <nav className="flex flex-wrap items-center justify-start md:justify-center gap-8 md:gap-12 text-xs pt-5 md:pt-1">
          {tabs.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setTab(label)}
              className={`uppercase font-light text-[12px] cursor-pointer pb-2 ${
                tab === label ? 'border-b border-black' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  )
}

export default Headers
