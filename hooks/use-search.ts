"use client"

import { useState } from "react"
import type { SearchResult } from "@/types/entities"

interface UseSearchReturn {
  searchResults: SearchResult | null
  loading: boolean
  error: string | null
  performSearch: (query: string) => Promise<void>
  clearSearch: () => void
}

export function useSearch(): UseSearchReturn {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to perform search")
      }

      setSearchResults(result.data)
    } catch (err) {
      console.error("Error performing search:", err)
      setError(err instanceof Error ? err.message : "Failed to perform search")
      setSearchResults(null)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
    setError(null)
  }

  return {
    searchResults,
    loading,
    error,
    performSearch,
    clearSearch,
  }
}
