import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ContainerHeader from './_components/containerHeader'
import HomePageSectionTable from './_components/actions/home_section/homepage_section_table'
import BannerTable from './_components/actions/banner_section/banner_section_table'
import PromoCodeTable from './_components/actions/promo-code-section/promoCodeTable'

const Page = async () => {
  const cu = await auth()
  if (!cu?.user) redirect('/sign-in')


  return (
    <div className="space-y-10">
      <ContainerHeader />
      {/* home page section */}
      <HomePageSectionTable />

      {/* Banner section */}
      <div>
        <BannerTable />
      </div>

      {/* promo code section */}
      <div>
        <PromoCodeTable />
      </div>

      {/* testomonails section */}
      {/* <div>
        <TestimonialTable />
      </div> */}

      {/* policy section  */}
      {/* <div>
        <PolicyTable />
      </div> */}
    </div>
  )
}

export default Page
