"use client"

import useSWR from "swr"
import type { Biblioteca } from "@/types/entities"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error)
  }
  return data.data
}

export function useLibraries() {
  const {
    data: libraries = [],
    error,
    isLoading,
    mutate: mutateLibraries,
  } = useSWR<Biblioteca[]>("/api/bibliotecas", fetcher)

  const createLibrary = async (libraryData: { nombre: string; ubicacion: string }) => {
    try {
      const response = await fetch("/api/bibliotecas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(libraryData),
      })
      const data = await response.json()
      if (data.success) {
        mutateLibraries([...libraries, data.data], false)
        mutateLibraries()
        return data.data
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear biblioteca"
      throw new Error(errorMessage)
    }
  }

  const deleteLibrary = async (id: string) => {
    try {
      const response = await fetch(`/api/bibliotecas/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        mutateLibraries(
          libraries.filter((library) => library.id !== id),
          false,
        )
        mutateLibraries()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar biblioteca"
      throw new Error(errorMessage)
    }
  }

  return {
    libraries,
    loading: isLoading,
    error: error?.message || null,
    createLibrary,
    deleteLibrary,
    refreshLibraries: () => mutateLibraries(),
  }
}
