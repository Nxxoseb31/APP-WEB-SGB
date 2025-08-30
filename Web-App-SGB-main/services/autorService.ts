import { database } from "@/lib/database"
import type { Autor, CreateAutorData } from "@/types/entities"

export class AutorService {
  static async getAllAutores(): Promise<Autor[]> {
    return database.getAllAutores()
  }

  static async createAutor(data: CreateAutorData): Promise<Autor> {
    // Validations
    if (!data.nombre?.trim()) {
      throw new Error("El nombre del autor es requerido")
    }
    if (!data.nacionalidad?.trim()) {
      throw new Error("La nacionalidad del autor es requerida")
    }

    return database.createAutor({
      nombre: data.nombre.trim(),
      nacionalidad: data.nacionalidad.trim(),
    })
  }

  static async deleteAutor(id: string): Promise<void> {
    if (!id) {
      throw new Error("ID del autor es requerido")
    }

    const deleted = database.deleteAutor(id)
    if (!deleted) {
      throw new Error("Autor no encontrado")
    }
  }

  static async getAutorById(id: string): Promise<Autor | null> {
    const autor = database.getAutorById(id)
    return autor || null
  }

  static async updateAutor(id: string, data: CreateAutorData): Promise<Autor> {
    // Validations
    if (!data.nombre?.trim()) {
      throw new Error("El nombre del autor es requerido")
    }
    if (!data.nacionalidad?.trim()) {
      throw new Error("La nacionalidad del autor es requerida")
    }

    return database.updateAutor(id, {
      nombre: data.nombre.trim(),
      nacionalidad: data.nacionalidad.trim(),
    })
  }
}
