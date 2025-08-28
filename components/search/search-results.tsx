"use client"

import type { SearchResults as SearchResultsType } from "@/types/entities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, User, Book, Building } from "lucide-react"

interface SearchResultsProps {
  results: SearchResultsType
  onClose: () => void
}

export function SearchResults({ results, onClose }: SearchResultsProps) {
  const hasResults = results.autores.length > 0 || results.libros.length > 0 || results.bibliotecas.length > 0

  if (!hasResults) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">No se encontraron resultados</p>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-lg max-h-96 overflow-y-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Resultados de Búsqueda</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.autores.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              Autores ({results.autores.length})
            </h4>
            <div className="space-y-2">
              {results.autores.map((autor) => (
                <div key={autor.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">{autor.nombre}</p>
                  <p className="text-sm text-gray-600">{autor.nacionalidad}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.libros.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Book className="h-4 w-4" />
              Libros ({results.libros.length})
            </h4>
            <div className="space-y-2">
              {results.libros.map((libro) => (
                <div key={libro.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">{libro.titulo}</p>
                  <p className="text-sm text-gray-600">Año: {libro.año}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.bibliotecas.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Building className="h-4 w-4" />
              Bibliotecas ({results.bibliotecas.length})
            </h4>
            <div className="space-y-2">
              {results.bibliotecas.map((biblioteca) => (
                <div key={biblioteca.id} className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">{biblioteca.nombre}</p>
                  <p className="text-sm text-gray-600">{biblioteca.ubicacion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
