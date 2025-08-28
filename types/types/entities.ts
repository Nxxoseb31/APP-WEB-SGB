export interface Autor {
  id: string
  nombre: string
  nacionalidad: string
}

export interface Libro {
  id: string
  titulo: string
  año: number
  autores: string[] // IDs de autores
}

export interface Biblioteca {
  id: string
  nombre: string
  ubicacion: string
  libros: string[] // IDs de libros
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
