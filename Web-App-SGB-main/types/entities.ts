export interface Autor {
  id: string
  nombre: string
  nacionalidad: string
  fechaRegistro?: string
}

export interface Libro {
  id: string
  titulo: string
  año: number
  autores: string[] // Array of author IDs
  bibliotecas?: string[] // Array of library IDs
  fechaRegistro?: string
}

export interface Biblioteca {
  id: string
  nombre: string
  ubicacion: string
  libros?: string[] // Array of book IDs
  fechaRegistro?: string
}

export interface SearchResults {
  autores: Autor[]
  libros: Libro[]
  bibliotecas: Biblioteca[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

// Form data types
export interface CreateAutorData {
  nombre: string
  nacionalidad: string
}

export interface CreateLibroData {
  titulo: string
  año: number
  autores: string[]
  bibliotecas?: string[]
}

export interface CreateBibliotecaData {
  nombre: string
  ubicacion: string
}
