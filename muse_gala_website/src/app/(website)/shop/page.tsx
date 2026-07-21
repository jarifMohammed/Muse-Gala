import HowItWork from '@/components/HowItWork'
import GiveAndTake from '@/components/section/GiveAndTake'
import React from 'react'
import FilterProduct from './_component/FilterProduct'
import AllProduct from './_component/AllProduct'
import { FilterDrawer } from './_component/FilterDrawer'
// import DocumentVerification from '../account/_components/document-verification'

const page = () => {
  return (
    <div className="max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6 pb-8 pt-[100px]">
      <div className="text-center">
        <h1 className=" uppercase headerClass font-light">RENT</h1>
        <p className="font-avenir text-sm font-light uppercase sub-title text-black/70 !tracking-[.2rem]">
          Curated designer rentals for every moment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-10">
        <div className="lg:hidden">
          <FilterDrawer />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <FilterProduct />
        </div>

        <div className="flex-1 mb-5 md:mb-8 lg:col-span-4">
          <AllProduct />
        </div>
      </div>

      <div className="space-y-6 md:space-y-10">
        <HowItWork />

        <GiveAndTake />
      </div>
    </div>
  )
}

export default page
