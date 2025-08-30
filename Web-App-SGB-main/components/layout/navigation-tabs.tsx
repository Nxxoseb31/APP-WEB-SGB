"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthorSection } from "@/components/authors/author-section"
import { BookSection } from "@/components/books/book-section"
import { LibrarySection } from "@/components/libraries/library-section"

export function NavigationTabs() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Tabs defaultValue="autores" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="autores">Autores</TabsTrigger>
          <TabsTrigger value="libros">Libros</TabsTrigger>
          <TabsTrigger value="bibliotecas">Bibliotecas</TabsTrigger>
        </TabsList>

        <TabsContent value="autores">
          <AuthorSection />
        </TabsContent>

        <TabsContent value="libros">
          <BookSection />
        </TabsContent>

        <TabsContent value="bibliotecas">
          <LibrarySection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
