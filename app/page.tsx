"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { NavigationTabs } from "@/components/layout/navigation-tabs"
import { AuthorForm } from "@/components/authors/author-form"
import { AuthorList } from "@/components/authors/author-list"
import { BookForm } from "@/components/books/book-form"
import { BookList } from "@/components/books/book-list"
import { LibraryForm } from "@/components/libraries/library-form"
import { LibraryList } from "@/components/libraries/library-list"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("autores")

  const renderContent = () => {
    switch (activeTab) {
      case "autores":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AuthorForm />
            <AuthorList />
          </div>
        )
      case "libros":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BookForm />
            <BookList />
          </div>
        )
      case "bibliotecas":
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
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {renderContent()}
      </main>
    </div>
  )
}
