"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormSection } from "@/components/ui/form-section"
import { useToast } from "@/hooks/use-toast"
import type { CreateAutorDTO } from "@/types/entities"

interface AuthorFormProps {
  onSubmit: (data: CreateAutorDTO) => Promise<void>
  loading?: boolean
}

export function AuthorForm({ onSubmit, loading = false }: AuthorFormProps) {
  const [formData, setFormData] = useState<CreateAutorDTO>({
    nombre: "",
    nacionalidad: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim() || !formData.nacionalidad.trim()) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(formData)

      // Reset form on success
      setFormData({ nombre: "", nacionalidad: "" })

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateAutorDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <FormSection title="Registrar Nuevo Autor" description="Agrega un nuevo autor al sistema">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            placeholder="Nombre del autor"
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            disabled={isSubmitting || loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nacionalidad">Nacionalidad</Label>
          <Input
            id="nacionalidad"
            placeholder="Nacionalidad del autor"
            value={formData.nacionalidad}
            onChange={(e) => handleInputChange("nacionalidad", e.target.value)}
            disabled={isSubmitting || loading}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || loading} className="w-full">
          {isSubmitting ? "Registrando..." : "Registrar Autor"}
        </Button>
      </form>
    </FormSection>
  )
}
