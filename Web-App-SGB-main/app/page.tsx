"use client"

import { useState } from "react"
import { SearchBar } from "@/components/layout/search-bar"
import { NavigationTabs } from "@/components/layout/navigation-tabs"
import { AuthorForm } from "@/components/authors/author-form"
import { AuthorList } from "@/components/authors/author-list"
import { BookForm } from "@/components/books/book-form"
import { BookList } from "@/components/books/book-list"
import { LibraryForm } from "@/components/libraries/library-form"
import { LibraryList } from "@/components/libraries/library-list"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("books")

  const renderContent = () => {
    switch (activeTab) {
      case "authors":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AuthorForm />
            <AuthorList />
          </div>
        )
      case "books":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BookForm />
            <BookList />
          </div>
        )
      case "libraries":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LibraryForm />
            <LibraryList />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Gestión de Bibliotecas</h1>
          <p className="text-gray-600">Administra autores, libros y bibliotecas de forma eficiente</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 max-w-md mx-auto">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  )
}
