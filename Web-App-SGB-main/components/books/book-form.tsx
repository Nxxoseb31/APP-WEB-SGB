"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection } from "@/components/ui/form-section"
import { useToast } from "@/hooks/use-toast"
import type { CreateLibroDTO, Autor, Biblioteca } from "@/types/entities"

interface BookFormProps {
  onSubmit: (data: CreateLibroDTO) => Promise<void>
  loading?: boolean
}

export function BookForm({ onSubmit, loading = false }: BookFormProps) {
  const [formData, setFormData] = useState<CreateLibroDTO>({
    titulo: "",
    anoPublicacion: new Date().getFullYear(),
    autorIds: [],
    bibliotecaIds: [],
  })
  const [autores, setAutores] = useState<Autor[]>([])
  const [bibliotecas, setBibliotecas] = useState<Biblioteca[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const { toast } = useToast()

  // Fetch autores and bibliotecas for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        console.log("[v0] Fetching autores and bibliotecas...")

        const [autoresResponse, bibliotecasResponse] = await Promise.all([
          fetch("/api/autores"),
          fetch("/api/bibliotecas"),
        ])

        const autoresResult = await autoresResponse.json()
        const bibliotecasResult = await bibliotecasResponse.json()

        console.log("[v0] Autores result:", autoresResult)
        console.log("[v0] Bibliotecas result:", bibliotecasResult)

        if (autoresResult.success) {
          setAutores(autoresResult.data)
          console.log("[v0] Set autores:", autoresResult.data)
        } else {
          console.error("[v0] Failed to fetch autores:", autoresResult.error)
        }

        if (bibliotecasResult.success) {
          setBibliotecas(bibliotecasResult.data)
          console.log("[v0] Set bibliotecas:", bibliotecasResult.data)
        } else {
          console.error("[v0] Failed to fetch bibliotecas:", bibliotecasResult.error)
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
        toast({
          title: "Error",
          description: "Error al cargar datos para el formulario",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo.trim()) {
      toast({
        title: "Error",
        description: "El título es requerido",
        variant: "destructive",
      })
      return
    }

    if (formData.autorIds.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un autor",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(formData)

      // Reset form on success
      setFormData({
        titulo: "",
        anoPublicacion: new Date().getFullYear(),
        autorIds: [],
        bibliotecaIds: [],
      })

      toast({
        title: "Éxito",
        description: "Libro registrado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al registrar libro",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateLibroDTO, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormDisabled = isSubmitting || loading || loadingData

  return (
    <FormSection title="Registrar Nuevo Libro" description="Agrega un nuevo libro al sistema">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            placeholder="Título del libro"
            value={formData.titulo}
            onChange={(e) => handleInputChange("titulo", e.target.value)}
            disabled={isFormDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anoPublicacion">Año de Publicación</Label>
          <Input
            id="anoPublicacion"
            type="number"
            placeholder="Ej: 1967"
            value={formData.anoPublicacion}
            onChange={(e) => {
              const year = Number.parseInt(e.target.value) || new Date().getFullYear()
              handleInputChange("anoPublicacion", year)
            }}
            disabled={isFormDisabled}
            min="1000"
            max="2030"
            step="1"
          />
          <p className="text-xs text-muted-foreground">Ingresa el año de publicación (ej: 1967, 1982, 2010)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="autor">Autor</Label>
          {loadingData ? (
            <div className="text-sm text-muted-foreground">Cargando autores...</div>
          ) : (
            <Select
              disabled={isFormDisabled || autores.length === 0}
              onValueChange={(value) => {
                console.log("[v0] Selected author:", value)
                handleInputChange("autorIds", [value])
              }}
              value={formData.autorIds[0] || ""}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={autores.length === 0 ? "No hay autores disponibles" : "Selecciona un autor"}
                />
              </SelectTrigger>
              <SelectContent>
                {autores.map((autor) => (
                  <SelectItem key={autor.id} value={autor.id}>
                    {autor.nombre} ({autor.nacionalidad})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {autores.length === 0 && !loadingData && (
            <p className="text-sm text-muted-foreground">Primero debes registrar al menos un autor</p>
          )}
          {autores.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {autores.length} autor{autores.length !== 1 ? "es" : ""} disponible{autores.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="biblioteca">Biblioteca (Opcional)</Label>
          {loadingData ? (
            <div className="text-sm text-muted-foreground">Cargando bibliotecas...</div>
          ) : (
            <Select
              disabled={isFormDisabled || bibliotecas.length === 0}
              onValueChange={(value) => {
                console.log("[v0] Selected biblioteca:", value)
                handleInputChange("bibliotecaIds", value ? [value] : [])
              }}
              value={formData.bibliotecaIds?.[0] || ""}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    bibliotecas.length === 0 ? "No hay bibliotecas disponibles" : "Selecciona una biblioteca"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {bibliotecas.map((biblioteca) => (
                  <SelectItem key={biblioteca.id} value={biblioteca.id}>
                    {biblioteca.nombre} - {biblioteca.ubicacion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {bibliotecas.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {bibliotecas.length} biblioteca{bibliotecas.length !== 1 ? "s" : ""} disponible
              {bibliotecas.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isFormDisabled || autores.length === 0} className="w-full">
          {isSubmitting ? "Registrando..." : "Registrar Libro"}
        </Button>
      </form>
    </FormSection>
  )
}
