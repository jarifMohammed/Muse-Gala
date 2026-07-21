'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Filter } from 'lucide-react'
import SearchProduct from './filter/SearchProduct'
import Rental from './filter/Rental'
import { LocalPickup } from './filter/LocalPickup'
// import EventDate from './filter/EventDate'
import Price from './filter/Price'
import Size from './filter/Size'

import { useFilterStore } from '@/zustand/filterStore'

export function FilterDrawer() {
  const { resetFilters } = useFilterStore()

  return (
    <Drawer>
      <div className="flex justify-end">
        <DrawerTrigger asChild className="lg:hidden">
          <Button variant="outline" className="font-avenir">
            <Filter /> Filter
          </Button>
        </DrawerTrigger>
      </div>

      <DrawerContent className="font-avenir h-[90vh]">
        <div className="container overflow-y-auto font-avenir h-full pt-10 pb-10">
          <SearchProduct />
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
      </DrawerContent>
    </Drawer>
  )
}
