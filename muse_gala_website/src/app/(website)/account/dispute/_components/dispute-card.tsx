import Link from 'next/link'

type Dispute = {
  _id?: string
  status?: 'Pending' | 'Resolved' | string
  createdAt?: string
  issueType?: string
  description?: string
}

interface DisputeCardProps {
  dispute: Dispute
}

const DisputeCard = ({ dispute }: DisputeCardProps) => {
  return (
    <div className="font-avenir tracking-widest opacity-80 border-b-2 border-gray-400 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Dispute ID: {dispute?._id}</h1>

        <button
          className={`font-bold rounded-3xl py-1 px-2 text-sm ${
            dispute?.status === 'Pending' && 'bg-yellow-100 text-yellow-700'
          } ${dispute?.status === 'Resolved' && 'bg-green-100 text-green-700'}`}
        >
          {dispute?.status}
        </button>
      </div>

      <p className="my-2">
        Date: {new Date(dispute?.createdAt as string).toLocaleDateString()}{' '}
      </p>
      <p className="mb-2">Issue: {dispute?.issueType}</p>

      <div className="flex items-center justify-between">
        <p>&quot;{dispute?.description}&quot;</p>

        <Link href={`/account/dispute/${dispute?._id}`}>
          <button className="border-b border-gray-400 text-sm">VIEW</button>
        </Link>
      </div>
    </div>
  )
}

export default DisputeCard
