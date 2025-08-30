"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthors } from "@/hooks/use-authors"

export function AuthorForm() {
  const [name, setName] = useState("")
  const [nationality, setNationality] = useState("")
  const { createAuthor, loading, error } = useAuthors()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !nationality.trim()) return

    const success = await createAuthor({ name: name.trim(), nationality: nationality.trim() })
    if (success) {
      setName("")
      setNationality("")
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
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nombre del autor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="nationality">Nacionalidad</Label>
            <Input
              id="nationality"
              type="text"
              placeholder="Nacionalidad del autor"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading || !name.trim() || !nationality.trim()}>
            {loading ? "Registrando..." : "Registrar Autor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
