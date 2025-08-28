"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useLibraries } from "@/hooks/use-libraries"

export function LibraryForm() {
  const [nombre, setNombre] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const { createLibrary, loading } = useLibraries()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createLibrary({ nombre, ubicacion })
      setNombre("")
      setUbicacion("")
    } catch (error) {
      // Error is handled by the hook
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Registrar Nueva Biblioteca</CardTitle>
        <p className="text-sm text-gray-600">Agrega una nueva biblioteca al sistema</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Nombre de la biblioteca"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              type="text"
              placeholder="Ubicación de la biblioteca"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Biblioteca"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
