"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBooks } from "@/hooks/use-books"
import { useAuthors } from "@/hooks/use-authors"
import { useLibraries } from "@/hooks/use-libraries"

export function BookForm() {
  const [titulo, setTitulo] = useState("")
  const [año, setAño] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [selectedLibrary, setSelectedLibrary] = useState("")
  const { createBook, loading } = useBooks()
  const { authors } = useAuthors()
  const { libraries } = useLibraries()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAuthor && authors.length > 0) return

    try {
      await createBook({
        titulo,
        año: Number.parseInt(año),
        autores: selectedAuthor ? [selectedAuthor] : [],
        biblioteca: selectedLibrary || undefined,
      })
      setTitulo("")
      setAño("")
      setSelectedAuthor("")
      setSelectedLibrary("")
    } catch (error) {
      // Error is handled by the hook
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Registrar Nuevo Libro</CardTitle>
        <p className="text-sm text-gray-600">Agrega un nuevo libro al sistema</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              type="text"
              placeholder="Título del libro"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="año">Año de Publicación</Label>
            <Input
              id="año"
              type="number"
              placeholder="2025"
              value={año}
              onChange={(e) => setAño(e.target.value)}
              min="1000"
              max="2030"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Ingresa el año de publicación (ej: 1967, 1982, 2010)</p>
          </div>
          <div>
            <Label htmlFor="autor">Autor</Label>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger>
                <SelectValue placeholder={authors.length === 0 ? "Sin autores" : "Selecciona un autor"} />
              </SelectTrigger>
              <SelectContent>
                {authors.length === 0 ? (
                  <SelectItem value="no-authors" disabled>
                    Sin autores disponibles
                  </SelectItem>
                ) : (
                  authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.nombre}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">{authors.length} autores disponibles</p>
          </div>
          <div>
            <Label htmlFor="biblioteca">Biblioteca (Opcional)</Label>
            <Select value={selectedLibrary} onValueChange={setSelectedLibrary}>
              <SelectTrigger>
                <SelectValue placeholder={libraries.length === 0 ? "Sin bibliotecas" : "Selecciona una biblioteca"} />
              </SelectTrigger>
              <SelectContent>
                {libraries.length === 0 ? (
                  <SelectItem value="no-libraries" disabled>
                    Sin bibliotecas disponibles
                  </SelectItem>
                ) : (
                  libraries.map((library) => (
                    <SelectItem key={library.id} value={library.id}>
                      {library.nombre}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {libraries.length} biblioteca{libraries.length !== 1 ? "s" : ""} disponible
              {libraries.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Libro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
