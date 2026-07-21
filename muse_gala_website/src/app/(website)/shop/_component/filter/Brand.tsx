'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useFilterStore } from '@/zustand/filterStore'
import { useEffect, useState } from 'react'

const Brand = () => {
  const { brand, setBrand } = useFilterStore()
  const [inputValue, setInputValue] = useState(brand)

  // Sync internal state with store (e.g. when reset)
  useEffect(() => {
    setInputValue(brand)
  }, [brand])

  // ✅ Debounce Logic (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setBrand(inputValue)
    }, 500)

    return () => clearTimeout(timer)
  }, [inputValue, setBrand])

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      <AccordionItem className="border-none" value="item-1">
        <AccordionTrigger className="uppercase font-avenir tracking-widest opacity-75 border-b border-black pb-2">
          Brand
        </AccordionTrigger>
        <AccordionContent className="mt-4">
          <input
            type="text"
            className="border border-black/20 px-3 py-2 focus:outline-none focus:border-black w-full font-avenir placeholder:font-avenir placeholder:text-black/30 text-sm"
            placeholder="Search brands..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default Brand
