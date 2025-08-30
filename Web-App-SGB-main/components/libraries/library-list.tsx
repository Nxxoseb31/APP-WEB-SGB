"use client"

import { useState } from "react"
import { Building2, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLibraries } from "@/hooks/use-libraries"
import { useToast } from "@/hooks/use-toast"
import type { Biblioteca } from "@/types/entities"

export function LibraryList() {
  const { libraries, loading, deleteLibrary, updateLibrary } = useLibraries()
  const { toast } = useToast()
  const [editingLibrary, setEditingLibrary] = useState<Biblioteca | null>(null)
  const [editForm, setEditForm] = useState({
    nombre: "",
    ubicacion: "",
  })

  const handleEdit = (library: Biblioteca) => {
    setEditingLibrary(library)
    setEditForm({
      nombre: library.nombre,
      ubicacion: library.ubicacion,
    })
  }

  const handleUpdate = async () => {
    if (!editingLibrary) return

    if (!editForm.nombre.trim() || !editForm.ubicacion.trim()) {
      toast({
        title: "Error",
        description: "Nombre y ubicación son requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      await updateLibrary(editingLibrary.id, {
        nombre: editForm.nombre.trim(),
        ubicacion: editForm.ubicacion.trim(),
      })
      setEditingLibrary(null)
      toast({
        title: "Éxito",
        description: "Biblioteca actualizada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar biblioteca",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la biblioteca "${nombre}"?`)) {
      try {
        await deleteLibrary(id)
        toast({
          title: "Éxito",
          description: "Biblioteca eliminada correctamente",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al eliminar biblioteca",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Bibliotecas</CardTitle>
        <CardDescription>Bibliotecas registradas en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Cargando bibliotecas...</p>
        ) : libraries.length === 0 ? (
          <p className="text-muted-foreground">No hay bibliotecas registradas</p>
        ) : (
          <div className="space-y-4">
            {libraries.map((biblioteca) => (
              <div key={biblioteca.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground">{biblioteca.nombre}</h3>
                      <Badge variant="outline">
                        {biblioteca.libros?.length || 0} libro{biblioteca.libros?.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Ubicación:</strong> {biblioteca.ubicacion}
                    </p>
                    {biblioteca.fechaRegistro && (
                      <p className="text-xs text-muted-foreground">Registrado: {biblioteca.fechaRegistro}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingLibrary?.id === biblioteca.id}
                      onOpenChange={(open) => !open && setEditingLibrary(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(biblioteca)} disabled={loading}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Editar Biblioteca</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-nombre">Nombre</Label>
                            <Input
                              id="edit-nombre"
                              value={editForm.nombre}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, nombre: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-ubicacion">Ubicación</Label>
                            <Input
                              id="edit-ubicacion"
                              value={editForm.ubicacion}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, ubicacion: e.target.value }))}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleUpdate} className="flex-1">
                              Actualizar
                            </Button>
                            <Button variant="outline" onClick={() => setEditingLibrary(null)} className="flex-1">
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(biblioteca.id, biblioteca.nombre)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
