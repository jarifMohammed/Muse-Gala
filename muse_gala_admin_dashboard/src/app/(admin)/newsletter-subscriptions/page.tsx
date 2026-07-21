import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import NewsletterHeader from './_components/newsletterHeader'
import NewsletterTableContainer from './_components/newsletterTableContainer'

const Page = async () => {
    const cu = await auth()
    if (!cu?.user) redirect('/sign-in')

    const accessToken = cu.user.accessToken

    return (
        <div className="space-y-[30px] p-[10px] font-sans">
            <NewsletterHeader />
            <NewsletterTableContainer accessToken={accessToken} />
        </div>
    )
}

export default Page
