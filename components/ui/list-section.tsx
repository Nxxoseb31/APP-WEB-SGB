import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ListSectionProps {
  title: string
  description: string
  children: React.ReactNode
  isEmpty?: boolean
  emptyMessage?: string
}

export function ListSection({ title, description, children, isEmpty, emptyMessage }: ListSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{emptyMessage || "No hay elementos para mostrar"}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
