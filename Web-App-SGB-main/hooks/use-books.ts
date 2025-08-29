"use client"

import { useState, useEffect } from "react"
import type { Libro, CreateLibroDTO } from "@/types/entities"

interface UseBooksReturn {
  libros: Libro[]
  loading: boolean
  error: string | null
  createLibro: (data: CreateLibroDTO) => Promise<void>
  refreshLibros: () => Promise<void>
}

export function useBooks(): UseBooksReturn {
  const [libros, setLibros] = useState<Libro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLibros = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/libros")
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch libros")
      }

      setLibros(result.data)
    } catch (err) {
      console.error("Error fetching libros:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch libros")
    } finally {
      setLoading(false)
    }
  }

  const createLibro = async (data: CreateLibroDTO) => {
    try {
      setError(null)
      const response = await fetch("/api/libros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to create libro")
      }

      // Refresh the list after creating
      await fetchLibros()
    } catch (err) {
      console.error("Error creating libro:", err)
      setError(err instanceof Error ? err.message : "Failed to create libro")
      throw err
    }
  }

  useEffect(() => {
    fetchLibros()
  }, [])

  return {
    libros,
    loading,
    error,
    createLibro,
    refreshLibros: fetchLibros,
  }
}
