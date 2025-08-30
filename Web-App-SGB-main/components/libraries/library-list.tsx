"use client"

import type React from "react"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLibraries } from "@/hooks/use-libraries"
import type { Library } from "@/types/entities"

export function LibraryList() {
  const { libraries, loading, error, updateLibrary, deleteLibrary } = useLibraries()
  const [editingLibrary, setEditingLibrary] = useState<Library | null>(null)
  const [editName, setEditName] = useState("")
  const [editLocation, setEditLocation] = useState("")

  const handleEdit = (library: Library) => {
    setEditingLibrary(library)
    setEditName(library.name)
    setEditLocation(library.location)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLibrary || !editName.trim() || !editLocation.trim()) return

    const success = await updateLibrary(editingLibrary.id, {
      name: editName.trim(),
      location: editLocation.trim(),
    })

    if (success) {
      setEditingLibrary(null)
      setEditName("")
      setEditLocation("")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta biblioteca? Se eliminará de todos los libros asociados.")) {
      const success = await deleteLibrary(id)
      if (success && editingLibrary?.id === id) {
        setEditingLibrary(null)
        setEditName("")
        setEditLocation("")
      }
    }
  }

  const handleCloseEdit = () => {
    setEditingLibrary(null)
    setEditName("")
    setEditLocation("")
  }

  if (loading) {
    return <div className="text-center py-8">Cargando bibliotecas...</div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Bibliotecas</CardTitle>
          <CardDescription>Bibliotecas registradas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          {libraries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay bibliotecas registradas</div>
          ) : (
            <div className="space-y-3">
              {libraries.map((library) => (
                <div
                  key={library.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{library.name}</h3>
                    <p className="text-sm text-gray-600">{library.location}</p>
                    <p className="text-xs text-gray-400">
                      Registrado: {new Date(library.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {library.books.length} libro{library.books.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(library)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(library.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingLibrary} onOpenChange={handleCloseEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Biblioteca</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-location">Ubicación</Label>
              <Input
                id="edit-location"
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseEdit} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!editName.trim() || !editLocation.trim()}
                onClick={async (e) => {
                  if (!editName.trim() && !editLocation.trim()) {
                    e.preventDefault()
                    if (confirm("Los campos están vacíos. ¿Deseas eliminar esta biblioteca?")) {
                      await handleDelete(editingLibrary!.id)
                    }
                  }
                }}
              >
                Actualizar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
