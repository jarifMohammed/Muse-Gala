'use client'

export default function ContainerHeader() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-start">
        <h1 className="text-2xl uppercase md:text-[32px] font-light tracking-[0.2em]">
          MANAGE TEAM
        </h1>
      </div>

      {/* <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-lg">
        <InfoCard title="Total Admins" value="##" />

        <InfoCard title="Active Roles" value="##" />
        <InfoCard title="Recent Actions" value="##" />
        <InfoCard title="Pending Invites" value="##" />
      </div> */}

      {/* {isError && (
        <p className="text-red-500 mt-3">Failed to load listings stats</p>
      )} */}
    </div>
  )
}
