"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormSection } from "@/components/ui/form-section"
import { useToast } from "@/hooks/use-toast"
import type { CreateBibliotecaDTO } from "@/types/entities"

interface LibraryFormProps {
  onSubmit: (data: CreateBibliotecaDTO) => Promise<void>
  loading?: boolean
}

export function LibraryForm({ onSubmit, loading = false }: LibraryFormProps) {
  const [formData, setFormData] = useState<CreateBibliotecaDTO>({
    nombre: "",
    ubicacion: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim() || !formData.ubicacion.trim()) {
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
      setFormData({ nombre: "", ubicacion: "" })

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateBibliotecaDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <FormSection title="Registrar Nueva Biblioteca" description="Agrega una nueva biblioteca al sistema">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            placeholder="Nombre de la biblioteca"
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            disabled={isSubmitting || loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            placeholder="Ubicación de la biblioteca"
            value={formData.ubicacion}
            onChange={(e) => handleInputChange("ubicacion", e.target.value)}
            disabled={isSubmitting || loading}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || loading} className="w-full">
          {isSubmitting ? "Registrando..." : "Registrar Biblioteca"}
        </Button>
      </form>
    </FormSection>
  )
}
