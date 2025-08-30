"use client"

import { useState } from "react"
import { Trash2, Book, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBooks } from "@/hooks/use-books"
import { useAuthors } from "@/hooks/use-authors"
import { useLibraries } from "@/hooks/use-libraries"
import { useToast } from "@/hooks/use-toast"
import type { Libro } from "@/types/entities"

export function BookList() {
  const { books, loading, deleteBook, updateBook } = useBooks()
  const { authors } = useAuthors()
  const { libraries } = useLibraries()
  const { toast } = useToast()
  const [editingBook, setEditingBook] = useState<Libro | null>(null)
  const [editForm, setEditForm] = useState({
    titulo: "",
    año: "",
    autores: [] as string[],
    bibliotecas: [] as string[],
  })

  const handleEdit = (book: Libro) => {
    setEditingBook(book)
    setEditForm({
      titulo: book.titulo,
      año: book.año.toString(),
      autores: book.autores,
      bibliotecas: book.bibliotecas || [],
    })
  }

  const handleUpdate = async () => {
    if (!editingBook) return

    if (!editForm.titulo.trim() || !editForm.año.trim() || editForm.autores.length === 0) {
      toast({
        title: "Error",
        description: "Título, año y al menos un autor son requeridos",
        variant: "destructive",
      })
      return
    }

    const añoNum = Number.parseInt(editForm.año)
    if (isNaN(añoNum) || añoNum < 1 || añoNum > 2050) {
      toast({
        title: "Error",
        description: "El año debe ser un número entre 1 y 2050",
        variant: "destructive",
      })
      return
    }

    try {
      await updateBook(editingBook.id, {
        titulo: editForm.titulo.trim(),
        año: añoNum,
        autores: editForm.autores,
        bibliotecas: editForm.bibliotecas,
      })
      setEditingBook(null)
      toast({
        title: "Éxito",
        description: "Libro actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar libro",
        variant: "destructive",
      })
    }
  }

  const handleAuthorSelect = (authorId: string) => {
    if (!editForm.autores.includes(authorId)) {
      setEditForm((prev) => ({
        ...prev,
        autores: [...prev.autores, authorId],
      }))
    }
  }

  const handleLibrarySelect = (libraryId: string) => {
    if (!editForm.bibliotecas.includes(libraryId)) {
      setEditForm((prev) => ({
        ...prev,
        bibliotecas: [...prev.bibliotecas, libraryId],
      }))
    }
  }

  const removeAuthor = (authorId: string) => {
    setEditForm((prev) => ({
      ...prev,
      autores: prev.autores.filter((id) => id !== authorId),
    }))
  }

  const removeLibrary = (libraryId: string) => {
    setEditForm((prev) => ({
      ...prev,
      bibliotecas: prev.bibliotecas.filter((id) => id !== libraryId),
    }))
  }

  const getAuthorNames = (authorIds: string[]) => {
    return authorIds
      .map((id) => {
        const author = authors.find((a) => a.id === id)
        return author ? author.nombre : "Autor desconocido"
      })
      .join(", ")
  }

  const getLibraryNames = (libraryIds: string[] = []) => {
    return libraryIds
      .map((id) => {
        const library = libraries.find((l) => l.id === id)
        return library ? library.nombre : "Biblioteca desconocida"
      })
      .join(", ")
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el libro "${titulo}"?`)) {
      try {
        await deleteBook(id)
        toast({
          title: "Éxito",
          description: "Libro eliminado correctamente",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al eliminar libro",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Libros</CardTitle>
        <CardDescription>Libros registrados en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Cargando libros...</p>
        ) : books.length === 0 ? (
          <p className="text-muted-foreground">No hay libros registrados</p>
        ) : (
          <div className="space-y-4">
            {books.map((libro) => (
              <div key={libro.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Book className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground">{libro.titulo}</h3>
                      <Badge variant="secondary">{libro.año}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Autores:</strong> {getAuthorNames(libro.autores)}
                    </p>
                    {libro.bibliotecas && libro.bibliotecas.length > 0 && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Bibliotecas:</strong> {getLibraryNames(libro.bibliotecas)}
                      </p>
                    )}
                    {libro.fechaRegistro && (
                      <p className="text-xs text-muted-foreground">Registrado: {libro.fechaRegistro}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editingBook?.id === libro.id} onOpenChange={(open) => !open && setEditingBook(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(libro)} disabled={loading}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Editar Libro</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-titulo">Título</Label>
                            <Input
                              id="edit-titulo"
                              value={editForm.titulo}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, titulo: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-año">Año</Label>
                            <Input
                              id="edit-año"
                              type="number"
                              min="1"
                              max="2050"
                              value={editForm.año}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, año: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Autores</Label>
                            <Select onValueChange={handleAuthorSelect}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar autor" />
                              </SelectTrigger>
                              <SelectContent>
                                {authors
                                  .filter((author) => !editForm.autores.includes(author.id))
                                  .map((author) => (
                                    <SelectItem key={author.id} value={author.id}>
                                      {author.nombre} ({author.nacionalidad})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-1">
                              {editForm.autores.map((authorId) => {
                                const author = authors.find((a) => a.id === authorId)
                                return (
                                  <Badge key={authorId} variant="secondary" className="text-xs">
                                    {author?.nombre}
                                    <button
                                      type="button"
                                      onClick={() => removeAuthor(authorId)}
                                      className="ml-1 text-destructive hover:text-destructive/80"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Bibliotecas</Label>
                            <Select onValueChange={handleLibrarySelect}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar biblioteca" />
                              </SelectTrigger>
                              <SelectContent>
                                {libraries
                                  .filter((library) => !editForm.bibliotecas.includes(library.id))
                                  .map((library) => (
                                    <SelectItem key={library.id} value={library.id}>
                                      {library.nombre} - {library.ubicacion}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-1">
                              {editForm.bibliotecas.map((libraryId) => {
                                const library = libraries.find((l) => l.id === libraryId)
                                return (
                                  <Badge key={libraryId} variant="secondary" className="text-xs">
                                    {library?.nombre}
                                    <button
                                      type="button"
                                      onClick={() => removeLibrary(libraryId)}
                                      className="ml-1 text-destructive hover:text-destructive/80"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleUpdate} className="flex-1">
                              Actualizar
                            </Button>
                            <Button variant="outline" onClick={() => setEditingBook(null)} className="flex-1">
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(libro.id, libro.titulo)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
