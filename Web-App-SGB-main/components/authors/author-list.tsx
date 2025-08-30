"use client"

import type React from "react"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuthors } from "@/hooks/use-authors"
import type { Author } from "@/types/entities"

export function AuthorList() {
  const { authors, loading, error, updateAuthor, deleteAuthor } = useAuthors()
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [editName, setEditName] = useState("")
  const [editNationality, setEditNationality] = useState("")

  const handleEdit = (author: Author) => {
    setEditingAuthor(author)
    setEditName(author.name)
    setEditNationality(author.nationality)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAuthor || !editName.trim() || !editNationality.trim()) return

    const success = await updateAuthor(editingAuthor.id, {
      name: editName.trim(),
      nationality: editNationality.trim(),
    })

    if (success) {
      setEditingAuthor(null)
      setEditName("")
      setEditNationality("")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este autor? Se eliminará de todos los libros asociados.")) {
      const success = await deleteAuthor(id)
      if (success && editingAuthor?.id === id) {
        setEditingAuthor(null)
        setEditName("")
        setEditNationality("")
      }
    }
  }

  const handleCloseEdit = () => {
    setEditingAuthor(null)
    setEditName("")
    setEditNationality("")
  }

  if (loading) {
    return <div className="text-center py-8">Cargando autores...</div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Autores</CardTitle>
          <CardDescription>Autores registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          {authors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay autores registrados</div>
          ) : (
            <div className="space-y-3">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{author.name}</h3>
                    <p className="text-sm text-gray-600">{author.nationality}</p>
                    <p className="text-xs text-gray-400">
                      Registrado: {new Date(author.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(author)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(author.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingAuthor} onOpenChange={handleCloseEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Autor</DialogTitle>
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
              <Label htmlFor="edit-nationality">Nacionalidad</Label>
              <Input
                id="edit-nationality"
                type="text"
                value={editNationality}
                onChange={(e) => setEditNationality(e.target.value)}
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
                disabled={!editName.trim() || !editNationality.trim()}
                onClick={async (e) => {
                  if (!editName.trim() && !editNationality.trim()) {
                    e.preventDefault()
                    if (confirm("Los campos están vacíos. ¿Deseas eliminar este autor?")) {
                      await handleDelete(editingAuthor!.id)
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
