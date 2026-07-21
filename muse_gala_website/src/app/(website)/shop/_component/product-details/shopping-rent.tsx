import RentalDates from './RentalDates'
import { usePathname } from 'next/navigation'

interface ShippingRentProps {
  bookedDates?: string[][]
}

const ShoppingRent: React.FC<ShippingRentProps> = () => {
  const pathName = usePathname()
  const isCheckoutPage =
    pathName?.startsWith('/shop/checkout') && !pathName.includes('/confirmation')

  return (
    <div className="font-avenir uppercase mt-10">
      <h1 className=" opacity-75 tracking-widest border-b border-black pb-1">
        {isCheckoutPage ? 'Event Date' : 'Select Event Date'}
      </h1>

      <div>
        <RentalDates />
      </div>
    </div>
  )
}

export default ShoppingRent
