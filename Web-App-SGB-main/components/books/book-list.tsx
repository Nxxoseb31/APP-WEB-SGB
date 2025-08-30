"use client"

import type React from "react"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useBooks } from "@/hooks/use-books"
import { useAuthors } from "@/hooks/use-authors"
import { useLibraries } from "@/hooks/use-libraries"
import type { Book } from "@/types/entities"

export function BookList() {
  const { books, loading, error, updateBook, deleteBook } = useBooks()
  const { authors } = useAuthors()
  const { libraries } = useLibraries()

  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editYear, setEditYear] = useState("")
  const [editSelectedAuthors, setEditSelectedAuthors] = useState<string[]>([])
  const [editSelectedLibraries, setEditSelectedLibraries] = useState<string[]>([])

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setEditTitle(book.title)
    setEditYear(book.year.toString())
    setEditSelectedAuthors(book.authors.map((a) => a.id))
    setEditSelectedLibraries(book.libraries.map((l) => l.id))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBook || !editTitle.trim() || !editYear) return

    const success = await updateBook(editingBook.id, {
      title: editTitle.trim(),
      year: Number.parseInt(editYear),
      authorIds: editSelectedAuthors,
      libraryIds: editSelectedLibraries,
    })

    if (success) {
      setEditingBook(null)
      setEditTitle("")
      setEditYear("")
      setEditSelectedAuthors([])
      setEditSelectedLibraries([])
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este libro?")) {
      await deleteBook(id)
    }
  }

  const handleCloseEdit = () => {
    setEditingBook(null)
    setEditTitle("")
    setEditYear("")
    setEditSelectedAuthors([])
    setEditSelectedLibraries([])
  }

  const handleAuthorChange = (authorId: string, checked: boolean) => {
    if (checked) {
      setEditSelectedAuthors((prev) => [...prev, authorId])
    } else {
      setEditSelectedAuthors((prev) => prev.filter((id) => id !== authorId))
    }
  }

  const handleLibraryChange = (libraryId: string, checked: boolean) => {
    if (checked) {
      setEditSelectedLibraries((prev) => [...prev, libraryId])
    } else {
      setEditSelectedLibraries((prev) => prev.filter((id) => id !== libraryId))
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando libros...</div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Libros</CardTitle>
          <CardDescription>Libros registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          {books.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay libros registrados</div>
          ) : (
            <div className="space-y-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-gray-600">Año: {book.year}</p>
                    <p className="text-sm text-gray-600">
                      Autores: {book.authors.length > 0 ? book.authors.map((a) => a.name).join(", ") : "Sin autores"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Bibliotecas:{" "}
                      {book.libraries.length > 0 ? book.libraries.map((l) => l.name).join(", ") : "Sin bibliotecas"}
                    </p>
                    <p className="text-xs text-gray-400">Registrado: {new Date(book.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingBook} onOpenChange={handleCloseEdit}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">Editar Libro</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-year">Año de Publicación</Label>
              <Input
                id="edit-year"
                type="number"
                min="1"
                max="2025"
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Autores</Label>
              {authors.length === 0 ? (
                <p className="text-sm text-gray-500">No hay autores disponibles</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-author-${author.id}`}
                        checked={editSelectedAuthors.includes(author.id)}
                        onCheckedChange={(checked) => handleAuthorChange(author.id, !!checked)}
                      />
                      <Label htmlFor={`edit-author-${author.id}`} className="text-sm">
                        {author.name} ({author.nationality})
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Bibliotecas</Label>
              {libraries.length === 0 ? (
                <p className="text-sm text-gray-500">No hay bibliotecas disponibles</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  {libraries.map((library) => (
                    <div key={library.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-library-${library.id}`}
                        checked={editSelectedLibraries.includes(library.id)}
                        onCheckedChange={(checked) => handleLibraryChange(library.id, !!checked)}
                      />
                      <Label htmlFor={`edit-library-${library.id}`} className="text-sm">
                        {library.name} ({library.location})
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseEdit} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={!editTitle.trim() || !editYear}>
                Actualizar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
