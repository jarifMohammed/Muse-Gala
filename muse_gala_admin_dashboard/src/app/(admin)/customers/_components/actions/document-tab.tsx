/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card } from '@/components/ui/card'

interface Props {
  data: any
}

const DocumentsTab = ({ data }: Props) => {
  const kyc = data?.kycDetails

  if (!kyc) {
    return (
      <Card className="shadow-none rounded-[6px] p-4">
        <p className="text-sm text-gray-600">No KYC details available.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      <Card className="shadow-none rounded-[6px]">
        <div className="p-4">
          <h2 className="text-lg font-semibold">KYC Documents</h2>
          <p className="text-sm text-gray-600 mb-4">
            Customer verification information from Stripe Identity.
          </p>

          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoRow label="Verification ID" value={kyc.id} />
            <InfoRow label="Status" value={kyc.status} />
            <InfoRow label="Type" value={kyc.type} />
            <InfoRow
              label="Created At"
              value={
                kyc.created
                  ? new Date(kyc.created * 1000).toLocaleString()
                  : '—'
              }
            />
          </div>

          {/* Document Allowed Types */}
          <div className="mt-6">
            <h3 className="font-medium text-base">Allowed Documents</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {(kyc.options?.document?.allowed_types || []).map(
                (item: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                  >
                    {item}
                  </span>
                )
              )}
              {!kyc.options?.document?.allowed_types?.length && (
                <span className="text-sm text-gray-500">—</span>
              )}
            </div>
          </div>

          {/* Other Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoRow
              label="Last Report"
              value={kyc.last_verification_report || '—'}
            />
            <InfoRow
              label="Client Reference ID"
              value={kyc.client_reference_id || '—'}
            />
            <InfoRow
              label="Related Customer"
              value={kyc.related_customer || '—'}
            />
            <InfoRow label="Live Mode" value={kyc.livemode ? 'Yes' : 'No'} />
          </div>

          {/* Metadata */}
          <div className="mt-6">
            <h3 className="font-medium text-base">Metadata</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              {kyc.metadata ? (
                Object.entries(kyc.metadata).map(([key, value]) => (
                  <InfoRow key={key} label={key} value={String(value)} />
                ))
              ) : (
                <span className="text-sm text-gray-500">—</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DocumentsTab

// -------------------
// SMALL COMPONENT
// -------------------
const InfoRow = ({ label, value }: { label: string; value: any }) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-base font-medium">{value || '—'}</span>
    </div>
  )
}
