"use client"

import type React from "react"

import { Trash2, Edit } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuthors } from "@/hooks/use-authors"
import { useToast } from "@/hooks/use-toast"
import type { Autor } from "@/types/entities"

export function AuthorList() {
  const { authors, loading, deleteAuthor, updateAuthor } = useAuthors()
  const { toast } = useToast()
  const [editingAuthor, setEditingAuthor] = useState<Autor | null>(null)
  const [editForm, setEditForm] = useState({ nombre: "", nacionalidad: "" })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al autor "${nombre}"?`)) {
      try {
        await deleteAuthor(id)
        toast({
          title: "Éxito",
          description: "Autor eliminado correctamente",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al eliminar autor",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (autor: Autor) => {
    setEditingAuthor(autor)
    setEditForm({ nombre: autor.nombre, nacionalidad: autor.nacionalidad })
    setIsEditDialogOpen(true)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAuthor) return

    try {
      await updateAuthor(editingAuthor.id, editForm)
      setIsEditDialogOpen(false)
      setEditingAuthor(null)
      toast({
        title: "Éxito",
        description: "Autor actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar autor",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Autores</CardTitle>
        <CardDescription>Autores registrados en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Cargando autores...</p>
        ) : authors.length === 0 ? (
          <p className="text-muted-foreground">No hay autores registrados</p>
        ) : (
          <div className="space-y-4">
            {authors.map((autor) => (
              <div key={autor.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-semibold text-foreground">{autor.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{autor.nacionalidad}</p>
                  {autor.fechaRegistro && (
                    <p className="text-xs text-muted-foreground">Registrado: {autor.fechaRegistro}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(autor)} disabled={loading}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(autor.id, autor.nombre)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Autor</DialogTitle>
              <DialogDescription>Modifica la información del autor</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nacionalidad">Nacionalidad</Label>
                <Input
                  id="edit-nacionalidad"
                  type="text"
                  value={editForm.nacionalidad}
                  onChange={(e) => setEditForm({ ...editForm, nacionalidad: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
