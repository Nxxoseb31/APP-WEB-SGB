"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLibraries } from "@/hooks/use-libraries"

export function LibraryForm() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const { createLibrary, loading, error } = useLibraries()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !location.trim()) return

    const success = await createLibrary({ name: name.trim(), location: location.trim() })
    if (success) {
      setName("")
      setLocation("")
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
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nombre de la biblioteca"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              type="text"
              placeholder="Ubicación de la biblioteca"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading || !name.trim() || !location.trim()}>
            {loading ? "Registrando..." : "Registrar Biblioteca"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
