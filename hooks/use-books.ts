"use client"

import useSWR from "swr"
import type { Libro } from "@/types/entities"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error)
  }
  return data.data
}

export function useBooks() {
  const { data: books = [], error, isLoading, mutate: mutateBooks } = useSWR<Libro[]>("/api/libros", fetcher)

  const createBook = async (bookData: { titulo: string; año: number; autores: string[] }) => {
    try {
      const response = await fetch("/api/libros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })
      const data = await response.json()
      if (data.success) {
        mutateBooks([...books, data.data], false)
        mutateBooks()
        return data.data
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear libro"
      throw new Error(errorMessage)
    }
  }

  const deleteBook = async (id: string) => {
    try {
      const response = await fetch(`/api/libros/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        mutateBooks(
          books.filter((book) => book.id !== id),
          false,
        )
        mutateBooks()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar libro"
      throw new Error(errorMessage)
    }
  }

  return {
    books,
    loading: isLoading,
    error: error?.message || null,
    createBook,
    deleteBook,
    refreshBooks: () => mutateBooks(),
  }
}
