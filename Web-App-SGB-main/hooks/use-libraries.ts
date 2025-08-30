"use client"

import { useState, useCallback } from "react"
import type { Biblioteca, CreateBibliotecaData, ApiResponse } from "@/types/entities"
import { useDataContext } from "@/contexts/data-context"

export function useLibraries() {
  const { libraries, refreshLibraries, refreshAll } = useDataContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createLibrary = useCallback(
    async (data: CreateBibliotecaData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/bibliotecas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const result: ApiResponse<Biblioteca> = await response.json()

        if (result.success) {
          await refreshAll()
          return result.data
        } else {
          setError(result.error || "Error al crear biblioteca")
          throw new Error(result.error || "Error al crear biblioteca")
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

  const updateLibrary = useCallback(
    async (id: string, data: CreateBibliotecaData) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/bibliotecas/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const result: ApiResponse<Biblioteca> = await response.json()

        if (result.success) {
          await refreshAll()
          return result.data
        } else {
          setError(result.error || "Error al actualizar biblioteca")
          throw new Error(result.error || "Error al actualizar biblioteca")
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

  const deleteLibrary = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/bibliotecas/${id}`, {
          method: "DELETE",
        })

        const result: ApiResponse<null> = await response.json()

        if (result.success) {
          await refreshAll()
        } else {
          setError(result.error || "Error al eliminar biblioteca")
          throw new Error(result.error || "Error al eliminar biblioteca")
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
    libraries,
    loading,
    error,
    createLibrary,
    updateLibrary,
    deleteLibrary,
    refreshLibraries,
  }
}
