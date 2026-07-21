"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setSearchQuery(newQuery)
    onSearch(newQuery) // Real-time search
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchQuery}
          onChange={handleChange}
          className="w-full border-b border-black py-2 pl-3 pr-10 text-xs uppercase  outline-none"
        />
        <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label="Search">
          <Search size={16} />
        </button>
      </form>
    </div>
  )
}
