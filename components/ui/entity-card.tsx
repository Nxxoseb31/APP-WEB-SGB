"use client"

import type React from "react"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EntityCardProps {
  children: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
}

export function EntityCard({ children, onEdit, onDelete, showActions = true }: EntityCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">{children}</div>

          {showActions && (
            <div className="flex gap-2 ml-4">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
