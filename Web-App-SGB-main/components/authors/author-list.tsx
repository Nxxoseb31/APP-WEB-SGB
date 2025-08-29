"use client"

import { ListSection } from "@/components/ui/list-section"
import { EntityCard } from "@/components/ui/entity-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Autor } from "@/types/entities"

interface AuthorListProps {
  autores: Autor[]
  loading?: boolean
  error?: string | null
}

export function AuthorList({ autores, loading = false, error }: AuthorListProps) {
  if (loading) {
    return (
      <ListSection title="Lista de Autores" description="Autores registrados en el sistema">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </ListSection>
    )
  }

  if (error) {
    return (
      <ListSection title="Lista de Autores" description="Autores registrados en el sistema">
        <div className="text-center py-8 text-destructive">
          <p>Error al cargar autores: {error}</p>
        </div>
      </ListSection>
    )
  }

  return (
    <ListSection
      title="Lista de Autores"
      description="Autores registrados en el sistema"
      isEmpty={autores.length === 0}
      emptyMessage="No hay autores registrados. Agrega el primer autor usando el formulario."
    >
      <div className="space-y-4">
        {autores.map((autor) => (
          <EntityCard key={autor.id} showActions={false}>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{autor.nombre}</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {autor.nacionalidad}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Registrado:{" "}
                {new Date(autor.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </EntityCard>
        ))}
      </div>
    </ListSection>
  )
}
