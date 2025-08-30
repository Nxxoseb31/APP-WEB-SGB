"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBooks } from "@/hooks/use-books"
import { useAuthors } from "@/hooks/use-authors"
import { useLibraries } from "@/hooks/use-libraries"
import { useToast } from "@/hooks/use-toast"

export function BookForm() {
  const [titulo, setTitulo] = useState("")
  const [año, setAño] = useState("")
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([])
  const { createBook, loading } = useBooks()
  const { authors } = useAuthors()
  const { libraries } = useLibraries()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !año.trim() || selectedAuthors.length === 0) {
      toast({
        title: "Error",
        description: "Título, año y al menos un autor son requeridos",
        variant: "destructive",
      })
      return
    }

    const añoNum = Number.parseInt(año)
    if (isNaN(añoNum) || añoNum < 1000 || añoNum > 2030) {
      toast({
        title: "Error",
        description: "El año debe ser un número entre 1000 y 2030",
        variant: "destructive",
      })
      return
    }

    try {
      await createBook({
        titulo: titulo.trim(),
        año: añoNum,
        autores: selectedAuthors,
        bibliotecas: selectedLibraries,
      })
      setTitulo("")
      setAño("")
      setSelectedAuthors([])
      setSelectedLibraries([])
      toast({
        title: "Éxito",
        description: "Libro registrado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al registrar libro",
        variant: "destructive",
      })
    }
  }

  const handleAuthorSelect = (authorId: string) => {
    if (!selectedAuthors.includes(authorId)) {
      setSelectedAuthors([...selectedAuthors, authorId])
    }
  }

  const handleLibrarySelect = (libraryId: string) => {
    if (!selectedLibraries.includes(libraryId)) {
      setSelectedLibraries([...selectedLibraries, libraryId])
    }
  }

  const removeAuthor = (authorId: string) => {
    setSelectedAuthors(selectedAuthors.filter((id) => id !== authorId))
  }

  const removeLibrary = (libraryId: string) => {
    setSelectedLibraries(selectedLibraries.filter((id) => id !== libraryId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nuevo Libro</CardTitle>
        <CardDescription>Agrega un nuevo libro al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              type="text"
              placeholder="Título del libro"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="año">Año de Publicación</Label>
            <Input
              id="año"
              type="number"
              placeholder="Año (1000-2030)"
              value={año}
              onChange={(e) => setAño(e.target.value)}
              disabled={loading}
              min="1000"
              max="2030"
            />
          </div>

          <div className="space-y-2">
            <Label>Autores (requerido)</Label>
            <div className="flex gap-2">
              <Select onValueChange={handleAuthorSelect} disabled={loading}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar autor" />
                </SelectTrigger>
                <SelectContent>
                  {authors
                    .filter((author) => !selectedAuthors.includes(author.id))
                    .map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.nombre} ({author.nacionalidad})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex-1 min-h-[40px] border rounded-md p-2 bg-muted/50">
                {selectedAuthors.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedAuthors.map((authorId) => {
                      const author = authors.find((a) => a.id === authorId)
                      return author ? (
                        <span
                          key={authorId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md"
                        >
                          {author.nombre}
                          <button
                            type="button"
                            onClick={() => removeAuthor(authorId)}
                            className="hover:bg-primary/80 rounded-full w-4 h-4 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </span>
                      ) : null
                    })}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Autores seleccionados aparecerán aquí</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bibliotecas (opcional)</Label>
            <div className="flex gap-2">
              <Select onValueChange={handleLibrarySelect} disabled={loading}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar biblioteca" />
                </SelectTrigger>
                <SelectContent>
                  {libraries
                    .filter((library) => !selectedLibraries.includes(library.id))
                    .map((library) => (
                      <SelectItem key={library.id} value={library.id}>
                        {library.nombre} - {library.ubicacion}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* Added selected libraries display to the right of selector */}
              <div className="flex-1 min-h-[40px] border rounded-md p-2 bg-muted/50">
                {selectedLibraries.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedLibraries.map((libraryId) => {
                      const library = libraries.find((l) => l.id === libraryId)
                      return library ? (
                        <span
                          key={libraryId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md"
                        >
                          {library.nombre}
                          <button
                            type="button"
                            onClick={() => removeLibrary(libraryId)}
                            className="hover:bg-primary/80 rounded-full w-4 h-4 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </span>
                      ) : null
                    })}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Bibliotecas seleccionadas aparecerán aquí</span>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registrando..." : "Registrar Libro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
