"use client"

import { useState, useEffect } from "react"
import type { Author } from "@/types/entities"
import { useDataContext } from "@/contexts/data-context"

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { authorsRefreshKey, refreshAll } = useDataContext()

  const fetchAuthors = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/authors")
      if (!response.ok) throw new Error("Error al cargar autores")
      const data = await response.json()
      setAuthors(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const createAuthor = async (data: { name: string; nationality: string }) => {
    try {
      const response = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      refreshAll()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear autor")
      return false
    }
  }

  const updateAuthor = async (id: string, data: { name?: string; nationality?: string }) => {
    try {
      if (!data.name?.trim() && !data.nationality?.trim()) {
        return await deleteAuthor(id)
      }

      const response = await fetch(`/api/authors?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      refreshAll()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar autor")
      return false
    }
  }

  const deleteAuthor = async (id: string) => {
    try {
      const response = await fetch(`/api/authors?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      refreshAll()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar autor")
      return false
    }
  }

  useEffect(() => {
    fetchAuthors()
  }, [authorsRefreshKey])

  return {
    authors,
    loading,
    error,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    refetch: fetchAuthors,
  }
}
