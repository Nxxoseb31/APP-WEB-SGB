"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuthors } from "@/hooks/use-authors"
import { useToast } from "@/hooks/use-toast"

export function AuthorForm() {
  const [nombre, setNombre] = useState("")
  const [nacionalidad, setNacionalidad] = useState("")
  const { createAuthor, loading } = useAuthors()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim() || !nacionalidad.trim()) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      await createAuthor({ nombre: nombre.trim(), nacionalidad: nacionalidad.trim() })
      setNombre("")
      setNacionalidad("")
      toast({
        title: "Éxito",
        description: "Autor registrado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al registrar autor",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nuevo Autor</CardTitle>
        <CardDescription>Agrega un nuevo autor al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Nombre del autor"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nacionalidad">Nacionalidad</Label>
            <Input
              id="nacionalidad"
              type="text"
              placeholder="Nacionalidad del autor"
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registrando..." : "Registrar Autor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
