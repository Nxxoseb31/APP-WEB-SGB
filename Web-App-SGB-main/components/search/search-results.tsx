"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, MapPin, User, X } from "lucide-react"
import type { SearchResult } from "@/types/entities"

interface SearchResultsProps {
  results: SearchResult
  onClose: () => void
  loading?: boolean
}

export function SearchResults({ results, onClose, loading = false }: SearchResultsProps) {
  const totalResults = results.autores.length + results.libros.length + results.bibliotecas.length

  if (totalResults === 0) {
    return (
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Resultados de Búsqueda</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No se encontraron resultados para tu búsqueda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Resultados de Búsqueda</CardTitle>
          <CardDescription>
            {totalResults} {totalResults === 1 ? "resultado encontrado" : "resultados encontrados"}
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Authors Results */}
        {results.autores.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Autores ({results.autores.length})</h3>
            </div>
            <div className="space-y-2">
              {results.autores.map((autor) => (
                <div key={autor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{autor.nombre}</p>
                    <p className="text-sm text-muted-foreground">{autor.nacionalidad}</p>
                  </div>
                  <Badge variant="secondary">Autor</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books Results */}
        {results.libros.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Libros ({results.libros.length})</h3>
            </div>
            <div className="space-y-2">
              {results.libros.map((libro) => (
                <div key={libro.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{libro.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">Año: {libro.anoPublicacion}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        {libro.autores.map((autor) => autor.nombre).join(", ")}
                      </p>
                    </div>
                    {libro.bibliotecas.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        En: {libro.bibliotecas.map((bib) => bib.nombre).join(", ")}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">Libro</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Libraries Results */}
        {results.bibliotecas.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Bibliotecas ({results.bibliotecas.length})</h3>
            </div>
            <div className="space-y-2">
              {results.bibliotecas.map((biblioteca) => (
                <div key={biblioteca.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{biblioteca.nombre}</p>
                    <p className="text-sm text-muted-foreground">{biblioteca.ubicacion}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {biblioteca.libros.length} {biblioteca.libros.length === 1 ? "libro" : "libros"} registrados
                    </p>
                  </div>
                  <Badge variant="secondary">Biblioteca</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
