"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Autor, Libro, Biblioteca } from "@/types/entities"

interface DataContextType {
  authors: Autor[]
  books: Libro[]
  libraries: Biblioteca[]
  refreshAuthors: () => Promise<void>
  refreshBooks: () => Promise<void>
  refreshLibraries: () => Promise<void>
  refreshAll: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [authors, setAuthors] = useState<Autor[]>([])
  const [books, setBooks] = useState<Libro[]>([])
  const [libraries, setLibraries] = useState<Biblioteca[]>([])

  const refreshAuthors = async () => {
    try {
      const response = await fetch("/api/autores")
      if (response.ok) {
        const data = await response.json()
        setAuthors(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching authors:", error)
    }
  }

  const refreshBooks = async () => {
    try {
      const response = await fetch("/api/libros")
      if (response.ok) {
        const data = await response.json()
        setBooks(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    }
  }

  const refreshLibraries = async () => {
    try {
      const response = await fetch("/api/bibliotecas")
      if (response.ok) {
        const data = await response.json()
        setLibraries(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching libraries:", error)
    }
  }

  const refreshAll = async () => {
    await Promise.all([refreshAuthors(), refreshBooks(), refreshLibraries()])
  }

  useEffect(() => {
    refreshAll()
  }, [])

  return (
    <DataContext.Provider
      value={{
        authors,
        books,
        libraries,
        refreshAuthors,
        refreshBooks,
        refreshLibraries,
        refreshAll,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}
