import { database } from "@/lib/database"
import type { Libro, CreateLibroData } from "@/types/entities"

export class LibroService {
  static async getAllLibros(): Promise<Libro[]> {
    return database.getAllLibros()
  }

  static async createLibro(data: CreateLibroData): Promise<Libro> {
    // Validations
    if (!data.titulo?.trim()) {
      throw new Error("El título del libro es requerido")
    }
    if (!data.año || data.año < 1 || data.año > 2050) {
      throw new Error("El año debe estar entre 1 y 2050")
    }
    if (!data.autores || data.autores.length === 0) {
      throw new Error("El libro debe tener al menos un autor")
    }

    return database.createLibro({
      titulo: data.titulo.trim(),
      año: data.año,
      autores: data.autores,
      bibliotecas: data.bibliotecas || [],
    })
  }

  static async deleteLibro(id: string): Promise<void> {
    if (!id) {
      throw new Error("ID del libro es requerido")
    }

    const deleted = database.deleteLibro(id)
    if (!deleted) {
      throw new Error("Libro no encontrado")
    }
  }

  static async getLibroById(id: string): Promise<Libro | null> {
    const libro = database.getLibroById(id)
    return libro || null
  }

  static async updateLibro(id: string, data: CreateLibroData): Promise<Libro> {
    // Validations
    if (!data.titulo?.trim()) {
      throw new Error("El título del libro es requerido")
    }
    if (!data.año || data.año < 1 || data.año > 2050) {
      throw new Error("El año debe estar entre 1 y 2050")
    }
    if (!data.autores || data.autores.length === 0) {
      throw new Error("El libro debe tener al menos un autor")
    }

    return database.updateLibro(id, {
      titulo: data.titulo.trim(),
      año: data.año,
      autores: data.autores,
      bibliotecas: data.bibliotecas || [],
    })
  }
}
