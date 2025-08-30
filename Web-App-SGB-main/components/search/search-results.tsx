"use client"

import { X, User, Book, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SearchResults as SearchResultsType } from "@/types/entities"

interface SearchResultsProps {
  results: SearchResultsType
  onClose: () => void
}

export function SearchResults({ results, onClose }: SearchResultsProps) {
  const totalResults = results.autores.length + results.libros.length + results.bibliotecas.length

  if (totalResults === 0) {
    return (
      <Card className="bg-background border border-border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resultados de Búsqueda</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No se encontraron resultados</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background border border-border shadow-lg max-h-96 overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Resultados de Búsqueda ({totalResults} encontrado{totalResults !== 1 ? "s" : ""})
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.autores.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Autores ({results.autores.length})
            </h3>
            <div className="space-y-2">
              {results.autores.map((autor) => (
                <div key={autor.id} className="p-2 border border-border rounded">
                  <p className="font-medium text-sm">{autor.nombre}</p>
                  <p className="text-xs text-muted-foreground">{autor.nacionalidad}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.libros.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Book className="h-4 w-4" />
              Libros ({results.libros.length})
            </h3>
            <div className="space-y-2">
              {results.libros.map((libro) => (
                <div key={libro.id} className="p-2 border border-border rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{libro.titulo}</p>
                    <Badge variant="secondary" className="text-xs">
                      {libro.año}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {libro.autores.length} autor{libro.autores.length !== 1 ? "es" : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.bibliotecas.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Bibliotecas ({results.bibliotecas.length})
            </h3>
            <div className="space-y-2">
              {results.bibliotecas.map((biblioteca) => (
                <div key={biblioteca.id} className="p-2 border border-border rounded">
                  <p className="font-medium text-sm">{biblioteca.nombre}</p>
                  <p className="text-xs text-muted-foreground">{biblioteca.ubicacion}</p>
                  <p className="text-xs text-muted-foreground">
                    {biblioteca.libros?.length || 0} libro{biblioteca.libros?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
