"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { NavigationTabs, type TabType } from "@/components/layout/navigation-tabs"
import { SearchResults } from "@/components/search/search-results"
import { AuthorForm } from "@/components/authors/author-form"
import { AuthorList } from "@/components/authors/author-list"
import { BookForm } from "@/components/books/book-form"
import { BookList } from "@/components/books/book-list"
import { LibraryForm } from "@/components/libraries/library-form"
import { LibraryList } from "@/components/libraries/library-list"
import { useAuthors } from "@/hooks/use-authors"
import { useBooks } from "@/hooks/use-books"
import { useLibraries } from "@/hooks/use-libraries"
import { useSearch } from "@/hooks/use-search"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("autores")
  const { autores, loading: authorsLoading, error: authorsError, createAutor } = useAuthors()
  const { libros, loading: booksLoading, error: booksError, createLibro } = useBooks()
  const { bibliotecas, loading: librariesLoading, error: librariesError, createBiblioteca } = useLibraries()
  const { searchResults, loading: searchLoading, error: searchError, performSearch, clearSearch } = useSearch()

  const handleSearch = async (query: string) => {
    await performSearch(query)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "autores":
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AuthorForm onSubmit={createAutor} loading={authorsLoading} />
              <AuthorList autores={autores} loading={authorsLoading} error={authorsError} />
            </div>
          </div>
        )

      case "libros":
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BookForm onSubmit={createLibro} loading={booksLoading} />
              <BookList libros={libros} loading={booksLoading} error={booksError} />
            </div>
          </div>
        )

      case "bibliotecas":
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LibraryForm onSubmit={createBiblioteca} loading={librariesLoading} />
              <LibraryList bibliotecas={bibliotecas} loading={librariesLoading} error={librariesError} />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchLoading={searchLoading} />

      {/* Search Results Section */}
      {searchResults && (
        <div className="container mx-auto px-4 py-4">
          <SearchResults results={searchResults} onClose={clearSearch} loading={searchLoading} />
        </div>
      )}

      {/* Search Error */}
      {searchError && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-destructive">Error en la búsqueda: {searchError}</p>
          </div>
        </div>
      )}

      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  )
}
