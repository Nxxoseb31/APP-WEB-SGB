"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface DataContextType {
  // Data refresh triggers
  refreshAuthors: () => void
  refreshBooks: () => void
  refreshLibraries: () => void
  refreshAll: () => void

  // Refresh counters to trigger re-fetches
  authorsRefreshKey: number
  booksRefreshKey: number
  librariesRefreshKey: number
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [authorsRefreshKey, setAuthorsRefreshKey] = useState(0)
  const [booksRefreshKey, setBooksRefreshKey] = useState(0)
  const [librariesRefreshKey, setLibrariesRefreshKey] = useState(0)

  const refreshAuthors = useCallback(() => {
    setAuthorsRefreshKey((prev) => prev + 1)
  }, [])

  const refreshBooks = useCallback(() => {
    setBooksRefreshKey((prev) => prev + 1)
  }, [])

  const refreshLibraries = useCallback(() => {
    setLibrariesRefreshKey((prev) => prev + 1)
  }, [])

  const refreshAll = useCallback(() => {
    setAuthorsRefreshKey((prev) => prev + 1)
    setBooksRefreshKey((prev) => prev + 1)
    setLibrariesRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <DataContext.Provider
      value={{
        refreshAuthors,
        refreshBooks,
        refreshLibraries,
        refreshAll,
        authorsRefreshKey,
        booksRefreshKey,
        librariesRefreshKey,
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
