import { SearchBar } from "./search-bar"

interface HeaderProps {
  onSearch?: (query: string) => void
  searchLoading?: boolean
}

export function Header({ onSearch, searchLoading = false }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Gestión de Bibliotecas</h1>
          <p className="text-muted-foreground">Administra autores, libros y bibliotecas de forma eficiente</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <SearchBar onSearch={onSearch} loading={searchLoading} />
        </div>
      </div>
    </header>
  )
}
