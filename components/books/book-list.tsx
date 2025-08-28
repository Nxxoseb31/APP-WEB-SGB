"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { useBooks } from "@/hooks/use-books"
import { useAuthors } from "@/hooks/use-authors"
import { useLibraries } from "@/hooks/use-libraries"

export function BookList() {
  const { books, loading, error, deleteBook } = useBooks()
  const { authors } = useAuthors()
  const { libraries } = useLibraries()

  const getAuthorName = (authorId: string) => {
    const author = authors.find((a) => a.id === authorId)
    return author ? author.nombre : "Autor desconocido"
  }

  const getLibraryName = (libraryId: string) => {
    const library = libraries.find((l) => l.id === libraryId)
    return library ? library.nombre : "Biblioteca desconocida"
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el libro "${titulo}"?`)) {
      try {
        await deleteBook(id)
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Cargando libros...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Lista de Libros</CardTitle>
        <p className="text-sm text-gray-600">Libros registrados en el sistema</p>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        {books.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No hay libros registrados</p>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{book.titulo}</h3>
                    <p className="text-sm text-gray-600 font-medium">Año: {book.año}</p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Autores:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {book.autores.map((authorId) => (
                          <span key={authorId} className="text-sm text-gray-700">
                            {getAuthorName(authorId)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Biblioteca:</p>
                      <Badge variant="secondary" className="mt-1">
                        {book.biblioteca ? getLibraryName(book.biblioteca) : "Sin biblioteca asignada"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Registrado: {new Date(Number(book.id)).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(book.id, book.titulo)}
                    className="text-black hover:text-gray-700 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
