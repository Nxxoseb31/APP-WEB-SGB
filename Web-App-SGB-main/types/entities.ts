export interface Autor {
  id: string
  nombre: string
  nacionalidad: string
  createdAt: Date
  updatedAt: Date
}

export interface Libro {
  id: string
  titulo: string
  anoPublicacion: number
  autores: Autor[] // 1:N relationship - a book can have multiple authors
  bibliotecas: Biblioteca[] // N:M relationship - a book can be in multiple libraries
  createdAt: Date
  updatedAt: Date
}

export interface Biblioteca {
  id: string
  nombre: string
  ubicacion: string
  libros: Libro[] // N:M relationship - a library can have multiple books
  createdAt: Date
  updatedAt: Date
}

// DTOs for API operations
export interface CreateAutorDTO {
  nombre: string
  nacionalidad: string
}

export interface CreateLibroDTO {
  titulo: string
  anoPublicacion: number
  autorIds: string[]
  bibliotecaIds?: string[]
}

export interface CreateBibliotecaDTO {
  nombre: string
  ubicacion: string
  libroIds?: string[]
}

// Search and filter types
export interface SearchResult {
  autores: Autor[]
  libros: Libro[]
  bibliotecas: Biblioteca[]
}

export interface SearchFilters {
  query: string
  tipo?: "autor" | "libro" | "biblioteca" | "all"
}
