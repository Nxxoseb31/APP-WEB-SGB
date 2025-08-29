"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch?: (query: string) => void
  loading?: boolean
}

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium text-foreground">Búsqueda Global</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-3">Busca autores, libros o bibliotecas en todo el sistema</p>

      <div className="flex gap-2">
        <Input
          placeholder="Buscar por nombre, título, nacionalidad, ubicación..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSearch} disabled={loading || !query.trim()} className="px-6">
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  )
}
