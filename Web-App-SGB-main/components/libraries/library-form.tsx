"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLibraries } from "@/hooks/use-libraries"
import { useToast } from "@/hooks/use-toast"

export function LibraryForm() {
  const [nombre, setNombre] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const { createLibrary, loading } = useLibraries()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim() || !ubicacion.trim()) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      await createLibrary({ nombre: nombre.trim(), ubicacion: ubicacion.trim() })
      setNombre("")
      setUbicacion("")
      toast({
        title: "Éxito",
        description: "Biblioteca registrada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al registrar biblioteca",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nueva Biblioteca</CardTitle>
        <CardDescription>Agrega una nueva biblioteca al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Nombre de la biblioteca"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              type="text"
              placeholder="Ubicación de la biblioteca"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registrando..." : "Registrar Biblioteca"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
