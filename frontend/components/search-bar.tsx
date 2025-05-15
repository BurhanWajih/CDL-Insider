"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface SearchBarProps {
  placeholder?: string
  paramName?: string
  className?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({
  placeholder = "Search...",
  paramName = "q",
  className = "",
  onSearch,
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get(paramName) || "")

  useEffect(() => {
    // Update the query when the search param changes
    setQuery(searchParams.get(paramName) || "")
  }, [searchParams, paramName])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // If onSearch is provided, call it
    if (onSearch) {
      onSearch(query)
      return
    }

    // Otherwise, update the URL
    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set(paramName, query)
    } else {
      params.delete(paramName)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearSearch = () => {
    setQuery("")

    if (onSearch) {
      onSearch("")
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramName)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={`relative flex w-full ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" className="ml-2 bg-orange-500 hover:bg-orange-600">
        Search
      </Button>
    </form>
  )
}
