"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuthors } from "@/hooks/use-authors"

export function AuthorForm() {
  const [nombre, setNombre] = useState("")
  const [nacionalidad, setNacionalidad] = useState("")
  const { createAuthor, loading } = useAuthors()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAuthor({ nombre, nacionalidad })
      setNombre("")
      setNacionalidad("")
    } catch (error) {
      // Error is handled by the hook
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Registrar Nuevo Autor</CardTitle>
        <p className="text-sm text-gray-600">Agrega un nuevo autor al sistema</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Nombre del autor"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="nacionalidad">Nacionalidad</Label>
            <Input
              id="nacionalidad"
              type="text"
              placeholder="Nacionalidad del autor"
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Autor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
