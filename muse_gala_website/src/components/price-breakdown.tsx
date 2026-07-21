interface PriceBreakdownProps {
  rentalFee: number
  insuranceFee: number
  shippingFee: number
  total?: number // Optional total override
}

export function PriceBreakdown({ rentalFee, insuranceFee, shippingFee, total }: PriceBreakdownProps) {
  // Calculate total if not provided
  const calculatedTotal = total ?? rentalFee + insuranceFee + shippingFee

  return (
    <div className="space-y-4 text-[14px] leading-[20px] tracking-[0.2rem]">
      <h3 className="uppercase tracking-widest text-xs">PRICE BREAKDOWN</h3>
      <div className="h-[1px] bg-black w-full"></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="uppercase tracking-widest text-xs">RENTAL FEE</span>
          <span>${rentalFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="uppercase tracking-widest text-xs">INSURANCE</span>
          <span>${insuranceFee.toFixed(2)}</span>
        </div>
        {shippingFee > 0 && (
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-xs">SHIPPING</span>
            <span>${shippingFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-t-black">
          <span className="uppercase text-[18px]">TOTAL</span>
          <span>${calculatedTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
