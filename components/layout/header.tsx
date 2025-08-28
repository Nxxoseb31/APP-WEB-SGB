import { SearchBar } from "./search-bar"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">Sistema de Gestión de Bibliotecas</h1>
          <p className="text-gray-600 mt-2">Administra autores, libros y bibliotecas de forma eficiente</p>
        </div>
        <SearchBar />
      </div>
    </header>
  )
}
