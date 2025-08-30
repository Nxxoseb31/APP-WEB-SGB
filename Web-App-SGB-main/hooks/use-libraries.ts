"use client"

import { useState, useEffect } from "react"
import type { Library } from "@/types/entities"
import { useDataContext } from "@/contexts/data-context"

export function useLibraries() {
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { librariesRefreshKey, refreshAll } = useDataContext()

  const fetchLibraries = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/libraries")
      if (!response.ok) throw new Error("Error al cargar bibliotecas")
      const data = await response.json()
      setLibraries(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const createLibrary = async (data: { name: string; location: string }) => {
    try {
      const response = await fetch("/api/libraries", {
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
      setError(err instanceof Error ? err.message : "Error al crear biblioteca")
      return false
    }
  }

  const updateLibrary = async (id: string, data: { name?: string; location?: string }) => {
    try {
      if (!data.name?.trim() && !data.location?.trim()) {
        return await deleteLibrary(id)
      }

      const response = await fetch(`/api/libraries?id=${id}`, {
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
      setError(err instanceof Error ? err.message : "Error al actualizar biblioteca")
      return false
    }
  }

  const deleteLibrary = async (id: string) => {
    try {
      const response = await fetch(`/api/libraries?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      refreshAll()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar biblioteca")
      return false
    }
  }

  useEffect(() => {
    fetchLibraries()
  }, [librariesRefreshKey])

  return {
    libraries,
    loading,
    error,
    createLibrary,
    updateLibrary,
    deleteLibrary,
    refetch: fetchLibraries,
  }
}
