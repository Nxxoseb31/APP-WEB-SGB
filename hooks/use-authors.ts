"use client"

import { useState, useEffect } from "react"
import type { Autor, CreateAutorDTO } from "@/types/entities"

interface UseAuthorsReturn {
  autores: Autor[]
  loading: boolean
  error: string | null
  createAutor: (data: CreateAutorDTO) => Promise<void>
  refreshAutores: () => Promise<void>
}

export function useAuthors(): UseAuthorsReturn {
  const [autores, setAutores] = useState<Autor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAutores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/autores")
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch autores")
      }

      setAutores(result.data)
    } catch (err) {
      console.error("Error fetching autores:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch autores")
    } finally {
      setLoading(false)
    }
  }

  const createAutor = async (data: CreateAutorDTO) => {
    try {
      setError(null)
      const response = await fetch("/api/autores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to create autor")
      }

      // Refresh the list after creating
      await fetchAutores()
    } catch (err) {
      console.error("Error creating autor:", err)
      setError(err instanceof Error ? err.message : "Failed to create autor")
      throw err
    }
  }

  useEffect(() => {
    fetchAutores()
  }, [])

  return {
    autores,
    loading,
    error,
    createAutor,
    refreshAutores: fetchAutores,
  }
}
