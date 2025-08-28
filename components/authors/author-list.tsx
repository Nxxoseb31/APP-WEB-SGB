"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useAuthors } from "@/hooks/use-authors"

export function AuthorList() {
  const { authors, loading, error, deleteAuthor } = useAuthors()

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar al autor "${nombre}"?`)) {
      try {
        await deleteAuthor(id)
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Cargando autores...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Lista de Autores</CardTitle>
        <p className="text-sm text-gray-600">Autores registrados en el sistema</p>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        {authors.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No hay autores registrados</p>
        ) : (
          <div className="space-y-3">
            {authors.map((author) => (
              <div key={author.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{author.nombre}</h3>
                    <p className="text-sm text-gray-600">{author.nacionalidad}</p>
                    <p className="text-xs text-gray-500 mt-1">Registrado: {new Date().toLocaleDateString("es-ES")}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(author.id, author.nombre)}
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
