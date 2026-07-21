'use client'

import React from 'react'
import SearchProduct from './filter/SearchProduct'
import Rental from './filter/Rental'
import { LocalPickup } from './filter/LocalPickup'
// import EventDate from './filter/EventDate'
import Price from './filter/Price'
import Size from './filter/Size'
import Brand from './filter/Brand'

import { useFilterStore } from '@/zustand/filterStore'

const FilterProduct = () => {
  const { resetFilters } = useFilterStore()

  return (
    <div className=" space-y-5 font-avenir">
      <SearchProduct />
      <Brand />
      <Rental />
      <LocalPickup />
      {/* <EventDate /> */}
      <Price />
      <Size />

      <button
        onClick={resetFilters}
        className="w-full mt-4 py-2 text-sm uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-all duration-300"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FilterProduct
