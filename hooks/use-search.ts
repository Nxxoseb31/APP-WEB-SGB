"use client"

import { useState } from "react"
import type { SearchResults } from "@/types/entities"

export function useSearch() {
  const [results, setResults] = useState<SearchResults>({ autores: [], libros: [], bibliotecas: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults({ autores: [], libros: [], bibliotecas: [] })
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      if (data.success) {
        setResults(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Error en la búsqueda")
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults({ autores: [], libros: [], bibliotecas: [] })
    setError(null)
  }

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  }
}
