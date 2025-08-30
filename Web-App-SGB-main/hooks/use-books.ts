"use client"

import { useState, useCallback } from "react"
import type { Libro, CreateLibroData, ApiResponse } from "@/types/entities"
import { useDataContext } from "@/contexts/data-context"

export function useBooks() {
  const { books, refreshBooks, refreshAll } = useDataContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBook = useCallback(
    async (data: CreateLibroData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/libros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const result: ApiResponse<Libro> = await response.json()

        if (result.success) {
          await refreshAll()
          return result.data
        } else {
          setError(result.error || "Error al crear libro")
          throw new Error(result.error || "Error al crear libro")
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

  const updateBook = useCallback(
    async (id: string, data: CreateLibroData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/libros/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const result: ApiResponse<Libro> = await response.json()

        if (result.success) {
          await refreshAll()
          return result.data
        } else {
          setError(result.error || "Error al actualizar libro")
          throw new Error(result.error || "Error al actualizar libro")
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

  const deleteBook = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/libros/${id}`, {
          method: "DELETE",
        })

        const result: ApiResponse<null> = await response.json()

        if (result.success) {
          await refreshAll()
        } else {
          setError(result.error || "Error al eliminar libro")
          throw new Error(result.error || "Error al eliminar libro")
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
    books,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
    refreshBooks,
  }
}
