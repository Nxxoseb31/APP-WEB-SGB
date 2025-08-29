import { db } from "@/lib/database"
import type { Libro, CreateLibroDTO } from "@/types/entities"

export class LibroService {
  static async getAllLibros(): Promise<Libro[]> {
    try {
      return db.getAllLibros()
    } catch (error) {
      console.error("Error fetching libros:", error)
      throw new Error("Failed to fetch libros")
    }
  }

  static async getLibroById(id: string): Promise<Libro | null> {
    try {
      const libro = db.getLibroById(id)
      return libro || null
    } catch (error) {
      console.error("Error fetching libro:", error)
      throw new Error("Failed to fetch libro")
    }
  }

  static async createLibro(data: CreateLibroDTO): Promise<Libro> {
    try {
      // Validation
      if (!data.titulo?.trim()) {
        throw new Error("El título del libro es requerido")
      }
      if (!data.anoPublicacion || data.anoPublicacion < 1000 || data.anoPublicacion > new Date().getFullYear()) {
        throw new Error("El año de publicación debe ser válido")
      }
      if (!data.autorIds || data.autorIds.length === 0) {
        throw new Error("El libro debe tener al menos un autor")
      }

      // Validate authors exist
      const autores = db.getAllAutores()
      const validAutorIds = data.autorIds.filter((id) => autores.some((autor) => autor.id === id))

      if (validAutorIds.length !== data.autorIds.length) {
        throw new Error("Uno o más autores no existen")
      }

      // Validate bibliotecas if provided
      if (data.bibliotecaIds && data.bibliotecaIds.length > 0) {
        const bibliotecas = db.getAllBibliotecas()
        const validBibliotecaIds = data.bibliotecaIds.filter((id) =>
          bibliotecas.some((biblioteca) => biblioteca.id === id),
        )

        if (validBibliotecaIds.length !== data.bibliotecaIds.length) {
          throw new Error("Una o más bibliotecas no existen")
        }
      }

      // Check for duplicates
      const existingLibros = db.getAllLibros()
      const duplicate = existingLibros.find(
        (libro) =>
          libro.titulo.toLowerCase() === data.titulo.toLowerCase() && libro.anoPublicacion === data.anoPublicacion,
      )

      if (duplicate) {
        throw new Error("Ya existe un libro con ese título y año")
      }

      return db.createLibro({
        titulo: data.titulo.trim(),
        anoPublicacion: data.anoPublicacion,
        autorIds: data.autorIds,
        bibliotecaIds: data.bibliotecaIds,
      })
    } catch (error) {
      console.error("Error creating libro:", error)
      throw error
    }
  }

  static async searchLibros(query: string): Promise<Libro[]> {
    try {
      const results = db.search(query)
      return results.libros
    } catch (error) {
      console.error("Error searching libros:", error)
      throw new Error("Failed to search libros")
    }
  }
}
