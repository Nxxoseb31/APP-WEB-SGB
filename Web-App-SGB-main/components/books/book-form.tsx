"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useBooks } from "@/hooks/use-books"
import { useAuthors } from "@/hooks/use-authors"
import { useLibraries } from "@/hooks/use-libraries"

export function BookForm() {
  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([])

  const { createBook, loading, error } = useBooks()
  const { authors } = useAuthors()
  const { libraries } = useLibraries()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !year) return

    const success = await createBook({
      title: title.trim(),
      year: Number.parseInt(year),
      authorIds: selectedAuthors,
      libraryIds: selectedLibraries,
    })

    if (success) {
      setTitle("")
      setYear("")
      setSelectedAuthors([])
      setSelectedLibraries([])
    }
  }

  const handleAuthorChange = (authorId: string, checked: boolean) => {
    if (checked) {
      setSelectedAuthors((prev) => [...prev, authorId])
    } else {
      setSelectedAuthors((prev) => prev.filter((id) => id !== authorId))
    }
  }

  const handleLibraryChange = (libraryId: string, checked: boolean) => {
    if (checked) {
      setSelectedLibraries((prev) => [...prev, libraryId])
    } else {
      setSelectedLibraries((prev) => prev.filter((id) => id !== libraryId))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nuevo Libro</CardTitle>
        <CardDescription>Agrega un nuevo libro al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              placeholder="Título del libro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="year">Año de Publicación</Label>
            <Input
              id="year"
              type="number"
              placeholder="Año"
              min="1"
              max="2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Autores (opcional)</Label>
            {authors.length === 0 ? (
              <p className="text-sm text-gray-500">No hay autores disponibles</p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {authors.map((author) => (
                  <div key={author.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`author-${author.id}`}
                      checked={selectedAuthors.includes(author.id)}
                      onCheckedChange={(checked) => handleAuthorChange(author.id, !!checked)}
                    />
                    <Label htmlFor={`author-${author.id}`} className="text-sm">
                      {author.name} ({author.nationality})
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Bibliotecas (opcional)</Label>
            {libraries.length === 0 ? (
              <p className="text-sm text-gray-500">No hay bibliotecas disponibles</p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {libraries.map((library) => (
                  <div key={library.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`library-${library.id}`}
                      checked={selectedLibraries.includes(library.id)}
                      onCheckedChange={(checked) => handleLibraryChange(library.id, !!checked)}
                    />
                    <Label htmlFor={`library-${library.id}`} className="text-sm">
                      {library.name} ({library.location})
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading || !title.trim() || !year}>
            {loading ? "Registrando..." : "Registrar Libro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
