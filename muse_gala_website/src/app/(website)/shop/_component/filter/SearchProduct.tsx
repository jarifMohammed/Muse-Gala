'use client'

import { useFilterStore } from '@/zustand/filterStore'
import React, { useEffect, useState } from 'react'

const SearchProduct = () => {
  const { setSearch } = useFilterStore()
  const [inputValue, setInputValue] = useState('')

  // ✅ Debounce Logic (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue)
    }, 500)

    return () => clearTimeout(timer) // cleanup
  }, [inputValue, setSearch])

  return (
    <div>
      <input
        type="text"
        className="border-b border-black pb-1 focus:outline-none w-full font-avenir placeholder:font-avenir placeholder:tracking-widest placeholder:text-black/50"
        placeholder="SEARCH"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  )
}

export default SearchProduct
