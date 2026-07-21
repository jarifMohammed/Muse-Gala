'use client'

import { useFilterStore } from '@/zustand/filterStore'

export const LocalPickup = () => {
  const { shipping, localPickup, selectShipping, selectLocalPickup } =
    useFilterStore()

  return (
    <div className="py-6 tracking-widest text-gray-600">
      <h3 className="uppercase tracking-[5px] mb-3 border-b border-black pb-2">
        Delivery
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="shipping-filter"
            checked={shipping}
            onChange={selectShipping}
            className="h-4 w-4 accent-black cursor-pointer"
          />
          <label
            htmlFor="shipping-filter"
            className="font-avenir tracking-[0.2rem] opacity-75 uppercase cursor-pointer"
          >
            SHIPPING
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="local-pickup-filter"
            checked={localPickup}
            onChange={selectLocalPickup}
            className="h-4 w-4 accent-black cursor-pointer"
          />
          <label
            htmlFor="local-pickup-filter"
            className="font-avenir tracking-[0.2rem] opacity-75 uppercase cursor-pointer"
          >
            LOCAL PICKUP
          </label>
        </div>
      </div>
    </div>
  )
}
