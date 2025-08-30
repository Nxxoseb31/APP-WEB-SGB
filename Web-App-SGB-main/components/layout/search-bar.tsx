"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/hooks/use-search"
import { SearchResults } from "@/components/search/search-results"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const { results, loading, search, clearResults } = useSearch()

  const handleSearch = async () => {
    if (query.trim()) {
      await search(query)
      setShowResults(true)
    } else {
      clearResults()
      setShowResults(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleClear = () => {
    setQuery("")
    clearResults()
    setShowResults(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    // Auto-search after 2 characters
    if (newQuery.trim().length >= 2) {
      search(newQuery)
      setShowResults(true)
    } else if (newQuery.trim().length === 0) {
      clearResults()
      setShowResults(false)
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por nombre, título, nacionalidad, ubicación..."
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
        {showResults && (
          <Button variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <SearchResults results={results} onClose={handleClear} />
        </div>
      )}
    </div>
  )
}
