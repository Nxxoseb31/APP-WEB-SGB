"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/hooks/use-search"
import { SearchResults } from "@/components/search/search-results"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const { results, loading, search, clearResults } = useSearch()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() && query.length >= 1 && query.length <= 20) {
        search(query)
        setShowResults(true)
      } else if (!query.trim()) {
        clearResults()
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, search, clearResults])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (query.trim() && query.length >= 1 && query.length <= 20) {
      search(query)
      setShowResults(true)
    }
  }

  const handleInputFocus = () => {
    if (query.trim() && results.length > 0) {
      setShowResults(true)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por nombre, título, nacionalidad, ubicación..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={handleInputFocus}
            className="pl-10 pr-4"
            maxLength={20}
          />
        </div>
        <Button onClick={handleSearch} disabled={!query.trim()}>
          Buscar
        </Button>
      </div>

      {showResults && (
        <SearchResults
          results={results}
          loading={loading}
          onClose={() => setShowResults(false)}
          query={query}
          totalFound={results.length}
        />
      )}
    </div>
  )
}
