import { database } from "@/lib/database"
import type { Libro } from "@/types/entities"

export class LibroService {
  static async getAllLibros(): Promise<Libro[]> {
    return database.getAllLibros()
  }

  static async createLibro(data: { titulo: string; año: number; autores: string[] }): Promise<Libro> {
    if (!data.titulo.trim()) {
      throw new Error("El título es requerido")
    }
    if (data.año < 1000 || data.año > 2030) {
      throw new Error("El año debe estar entre 1000 y 2030")
    }
    if (!data.autores.length) {
      throw new Error("El libro debe tener al menos un autor")
    }

    // Validate authors exist
    data.autores.forEach((autorId) => {
      const autor = database.getAutorById(autorId)
      if (!autor) {
        throw new Error(`Autor con ID ${autorId} no encontrado`)
      }
    })

    return database.createLibro(data)
  }

  static async deleteLibro(id: string): Promise<void> {
    const libro = database.getLibroById(id)
    if (!libro) {
      throw new Error("Libro no encontrado")
    }
    database.deleteLibro(id)
  }
}
