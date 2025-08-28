"use client"

import useSWR from "swr"
import type { Autor } from "@/types/entities"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error)
  }
  return data.data
}

export function useAuthors() {
  const { data: authors = [], error, isLoading, mutate: mutateAuthors } = useSWR<Autor[]>("/api/autores", fetcher)

  const createAuthor = async (authorData: { nombre: string; nacionalidad: string }) => {
    try {
      const response = await fetch("/api/autores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authorData),
      })
      const data = await response.json()
      if (data.success) {
        mutateAuthors([...authors, data.data], false)
        mutateAuthors()
        return data.data
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear autor"
      throw new Error(errorMessage)
    }
  }

  const deleteAuthor = async (id: string) => {
    try {
      const response = await fetch(`/api/autores/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        mutateAuthors(
          authors.filter((author) => author.id !== id),
          false,
        )
        mutateAuthors()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar autor"
      throw new Error(errorMessage)
    }
  }

  return {
    authors,
    loading: isLoading,
    error: error?.message || null,
    createAuthor,
    deleteAuthor,
    refreshAuthors: () => mutateAuthors(),
  }
}
