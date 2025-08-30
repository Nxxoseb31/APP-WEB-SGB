"use client"

import { useState, useCallback } from "react"
import type { Autor, CreateAutorData, ApiResponse } from "@/types/entities"
import { useDataContext } from "@/contexts/data-context"

export function useAuthors() {
  const { authors, refreshAuthors, refreshAll } = useDataContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAuthor = useCallback(
    async (data: CreateAutorData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/autores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const result: ApiResponse<Autor> = await response.json()

        if (result.success) {
          await refreshAll()
          return result.data
        } else {
          setError(result.error || "Error al crear autor")
          throw new Error(result.error || "Error al crear autor")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error de conexión"
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [refreshAll],
  )

  const updateAuthor = useCallback(
    async (id: string, data: CreateAutorData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/autores/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const result: ApiResponse<Autor> = await response.json()

        if (result.success) {
          await refreshAll()
          return result.data
        } else {
          setError(result.error || "Error al actualizar autor")
          throw new Error(result.error || "Error al actualizar autor")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error de conexión"
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [refreshAll],
  )

  const deleteAuthor = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/autores/${id}`, {
          method: "DELETE",
        })

        const result: ApiResponse<null> = await response.json()

        if (result.success) {
          await refreshAll()
        } else {
          setError(result.error || "Error al eliminar autor")
          throw new Error(result.error || "Error al eliminar autor")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error de conexión"
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [refreshAll],
  )

  return {
    authors,
    loading,
    error,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    refreshAuthors,
  }
}
