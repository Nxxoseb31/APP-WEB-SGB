"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/types/entities"
import { useDataContext } from "@/contexts/data-context"

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { booksRefreshKey, refreshAll } = useDataContext()

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null) // Clear error before fetching
      const response = await fetch("/api/books")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al cargar libros")
      }
      const data = await response.json()
      setBooks(data)
    } catch (err) {
      console.error("[v0] Error fetching books:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      setBooks([]) // Set empty array on error to prevent undefined issues
    } finally {
      setLoading(false)
    }
  }

  const createBook = async (data: {
    title: string
    year: number
    authorIds: string[]
    libraryIds: string[]
  }) => {
    try {
      setError(null) // Clear error before creating
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear libro")
      }
      await refreshAll() // Wait for refresh to complete
      return true
    } catch (err) {
      console.error("[v0] Error creating book:", err)
      setError(err instanceof Error ? err.message : "Error al crear libro")
      return false
    }
  }

  const updateBook = async (
    id: string,
    data: {
      title?: string
      year?: number
      authorIds?: string[]
      libraryIds?: string[]
    },
  ) => {
    try {
      setError(null) // Clear error before updating

      if (
        !data.title?.trim() &&
        !data.year &&
        (!data.authorIds || data.authorIds.length === 0) &&
        (!data.libraryIds || data.libraryIds.length === 0)
      ) {
        return await deleteBook(id)
      }

      const cleanData = JSON.parse(
        JSON.stringify({
          title: data.title?.trim(),
          year: data.year,
          authorIds: Array.isArray(data.authorIds) ? [...data.authorIds] : [],
          libraryIds: Array.isArray(data.libraryIds) ? [...data.libraryIds] : [],
        }),
      )

      console.log("[v0] Updating book with clean data:", cleanData)

      const response = await fetch(`/api/books?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar libro")
      }

      await refreshAll()
      return true
    } catch (err) {
      console.error("[v0] Error updating book:", err)
      setError(err instanceof Error ? err.message : "Error al actualizar libro")
      return false
    }
  }

  const deleteBook = async (id: string) => {
    try {
      setError(null) // Clear error before deleting
      const response = await fetch(`/api/books?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar libro")
      }
      await refreshAll() // Wait for refresh to complete
      return true
    } catch (err) {
      console.error("[v0] Error deleting book:", err)
      setError(err instanceof Error ? err.message : "Error al eliminar libro")
      return false
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [booksRefreshKey])

  return {
    books,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
  }
}
