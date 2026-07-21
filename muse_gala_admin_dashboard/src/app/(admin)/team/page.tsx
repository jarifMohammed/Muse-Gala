import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ContainerHeader from './_components/ContainerHeader'
import AdminTable from './_components/actions/admin-team/adminTeamTable'
// import RolesPermissionsTable from './_components/actions/permissionsTable'

const Page = async () => {
  const cu = await auth()
  if (!cu?.user) redirect('/sign-in')


  return (
    <div className="space-y-10">
      <ContainerHeader />
      <div>
        <AdminTable />
      </div>
      {/* <div><RolesPermissionsTable /></div> */}
    </div>
  )
}

export default Page
