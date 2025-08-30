"use client"

import { useState, useCallback } from "react"
import type { SearchResults, ApiResponse } from "@/types/entities"

export function useSearch() {
  const [results, setResults] = useState<SearchResults>({
    autores: [],
    libros: [],
    bibliotecas: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults({ autores: [], libros: [], bibliotecas: [] })
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      const data: ApiResponse<SearchResults> = await response.json()

      if (data.success) {
        setResults(data.data)
      } else {
        setError(data.error || "Error en la búsqueda")
        setResults({ autores: [], libros: [], bibliotecas: [] })
      }
    } catch (err) {
      setError("Error de conexión")
      setResults({ autores: [], libros: [], bibliotecas: [] })
      console.error("[v0] Error searching:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults({ autores: [], libros: [], bibliotecas: [] })
    setError(null)
  }, [])

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  }
}
