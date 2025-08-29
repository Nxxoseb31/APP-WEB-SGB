"use client"

import { ListSection } from "@/components/ui/list-section"
import { EntityCard } from "@/components/ui/entity-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, BookOpen } from "lucide-react"
import type { Biblioteca } from "@/types/entities"

interface LibraryListProps {
  bibliotecas: Biblioteca[]
  loading?: boolean
  error?: string | null
}

export function LibraryList({ bibliotecas, loading = false, error }: LibraryListProps) {
  if (loading) {
    return (
      <ListSection title="Lista de Bibliotecas" description="Bibliotecas registradas en el sistema">
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
      <ListSection title="Lista de Bibliotecas" description="Bibliotecas registradas en el sistema">
        <div className="text-center py-8 text-destructive">
          <p>Error al cargar bibliotecas: {error}</p>
        </div>
      </ListSection>
    )
  }

  return (
    <ListSection
      title="Lista de Bibliotecas"
      description="Bibliotecas registradas en el sistema"
      isEmpty={bibliotecas.length === 0}
      emptyMessage="No hay bibliotecas registradas. Agrega la primera biblioteca usando el formulario."
    >
      <div className="space-y-4">
        {bibliotecas.map((biblioteca) => (
          <EntityCard key={biblioteca.id} showActions={false}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground text-lg">{biblioteca.nombre}</h3>
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {biblioteca.libros.length} {biblioteca.libros.length === 1 ? "libro" : "libros"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{biblioteca.ubicacion}</span>
              </div>

              {biblioteca.libros.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Libros registrados:</p>
                  <div className="flex flex-wrap gap-1">
                    {biblioteca.libros.slice(0, 3).map((libro) => (
                      <Badge key={libro.id} variant="secondary" className="text-xs">
                        {libro.titulo}
                      </Badge>
                    ))}
                    {biblioteca.libros.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{biblioteca.libros.length - 3} más
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {biblioteca.libros.length === 0 && (
                <p className="text-xs text-muted-foreground">Sin libros registrados</p>
              )}

              <p className="text-xs text-muted-foreground">
                Registrada:{" "}
                {new Date(biblioteca.createdAt).toLocaleDateString("es-ES", {
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
