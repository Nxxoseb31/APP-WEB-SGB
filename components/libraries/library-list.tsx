"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, MapPin, Book } from "lucide-react"
import { useLibraries } from "@/hooks/use-libraries"

export function LibraryList() {
  const { libraries, loading, error, deleteLibrary } = useLibraries()

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la biblioteca "${nombre}"?`)) {
      try {
        await deleteLibrary(id)
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Cargando bibliotecas...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Lista de Bibliotecas</CardTitle>
        <p className="text-sm text-gray-600">Bibliotecas registradas en el sistema</p>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        {libraries.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No hay bibliotecas registradas</p>
        ) : (
          <div className="space-y-3">
            {libraries.map((library) => (
              <div key={library.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{library.nombre}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">{library.ubicacion}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Libros registrados:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Book className="h-3 w-3" />
                          {library.libros.length} libro{library.libros.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Registrada: {new Date(Number.parseInt(library.id)).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(library.id, library.nombre)}
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
