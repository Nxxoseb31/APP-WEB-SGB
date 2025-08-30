"use client"

import { X, User, Book, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { SearchResult } from "@/types/entities"

interface SearchResultsProps {
  results: SearchResult[]
  loading: boolean
  onClose: () => void
  query: string
  totalFound: number
}

export function SearchResults({ results, loading, onClose, query, totalFound }: SearchResultsProps) {
  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "author":
        return <User className="h-4 w-4" />
      case "book":
        return <Book className="h-4 w-4" />
      case "library":
        return <Building className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "author":
        return "Autores"
      case "book":
        return "Libros"
      case "library":
        return "Bibliotecas"
    }
  }

  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = []
      }
      acc[result.type].push(result)
      return acc
    },
    {} as Record<string, SearchResult[]>,
  )

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm">Resultados de Búsqueda ({totalFound} encontrados)</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-500">Buscando...</div>
        ) : totalFound === 0 && query.trim() ? (
          <div className="text-center py-4 text-gray-500">No se encontraron resultados para "{query}"</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedResults).map(([type, typeResults]) => (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  {getIcon(type as SearchResult["type"])}
                  <span>
                    {getTypeLabel(type as SearchResult["type"])} ({typeResults.length})
                  </span>
                </div>
                <div className="space-y-1 ml-6">
                  {typeResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border-l-2 border-gray-200"
                    >
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-gray-500">{result.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
