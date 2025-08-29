import { db } from "@/lib/database"
import type { Autor, CreateAutorDTO } from "@/types/entities"

export class AutorService {
  static async getAllAutores(): Promise<Autor[]> {
    try {
      return db.getAllAutores()
    } catch (error) {
      console.error("Error fetching autores:", error)
      throw new Error("Failed to fetch autores")
    }
  }

  static async getAutorById(id: string): Promise<Autor | null> {
    try {
      const autor = db.getAutorById(id)
      return autor || null
    } catch (error) {
      console.error("Error fetching autor:", error)
      throw new Error("Failed to fetch autor")
    }
  }

  static async createAutor(data: CreateAutorDTO): Promise<Autor> {
    try {
      // Validation
      if (!data.nombre?.trim()) {
        throw new Error("El nombre del autor es requerido")
      }
      if (!data.nacionalidad?.trim()) {
        throw new Error("La nacionalidad del autor es requerida")
      }

      // Check for duplicates
      const existingAutores = db.getAllAutores()
      const duplicate = existingAutores.find((autor) => autor.nombre.toLowerCase() === data.nombre.toLowerCase())

      if (duplicate) {
        throw new Error("Ya existe un autor con ese nombre")
      }

      return db.createAutor({
        nombre: data.nombre.trim(),
        nacionalidad: data.nacionalidad.trim(),
      })
    } catch (error) {
      console.error("Error creating autor:", error)
      throw error
    }
  }

  static async searchAutores(query: string): Promise<Autor[]> {
    try {
      const results = db.search(query)
      return results.autores
    } catch (error) {
      console.error("Error searching autores:", error)
      throw new Error("Failed to search autores")
    }
  }
}
