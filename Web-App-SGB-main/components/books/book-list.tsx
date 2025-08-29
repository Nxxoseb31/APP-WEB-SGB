"use client"

import { ListSection } from "@/components/ui/list-section"
import { EntityCard } from "@/components/ui/entity-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Libro } from "@/types/entities"

interface BookListProps {
  libros: Libro[]
  loading?: boolean
  error?: string | null
}

export function BookList({ libros, loading = false, error }: BookListProps) {
  if (loading) {
    return (
      <ListSection title="Lista de Libros" description="Libros registrados en el sistema">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </ListSection>
    )
  }

  if (error) {
    return (
      <ListSection title="Lista de Libros" description="Libros registrados en el sistema">
        <div className="text-center py-8 text-destructive">
          <p>Error al cargar libros: {error}</p>
        </div>
      </ListSection>
    )
  }

  return (
    <ListSection
      title="Lista de Libros"
      description="Libros registrados en el sistema"
      isEmpty={libros.length === 0}
      emptyMessage="No hay libros registrados. Agrega el primer libro usando el formulario."
    >
      <div className="space-y-4">
        {libros.map((libro) => (
          <EntityCard key={libro.id} showActions={false}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground text-lg">{libro.titulo}</h3>
                <Badge variant="outline" className="text-xs">
                  Año: {libro.anoPublicacion}
                </Badge>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Autores:</p>
                  <div className="flex flex-wrap gap-1">
                    {libro.autores.map((autor) => (
                      <Badge key={autor.id} variant="secondary" className="text-xs">
                        {autor.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>

                {libro.bibliotecas.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Biblioteca:</p>
                    <div className="flex flex-wrap gap-1">
                      {libro.bibliotecas.map((biblioteca) => (
                        <Badge key={biblioteca.id} variant="default" className="text-xs">
                          {biblioteca.nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {libro.bibliotecas.length === 0 && <p className="text-xs text-muted-foreground">Sin biblioteca</p>}
              </div>

              <p className="text-xs text-muted-foreground">
                Registrado:{" "}
                {new Date(libro.createdAt).toLocaleDateString("es-ES", {
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
