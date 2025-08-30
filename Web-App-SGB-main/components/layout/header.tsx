"use client"

import { SearchBar } from "./search-bar"

export function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Gestión de Bibliotecas</h1>
          <p className="text-muted-foreground">Administra autores, libros y bibliotecas de forma eficiente</p>
        </div>
        <SearchBar />
      </div>
    </header>
  )
}
