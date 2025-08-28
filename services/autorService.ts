import { database } from "@/lib/database"
import type { Autor } from "@/types/entities"

export class AutorService {
  static async getAllAutores(): Promise<Autor[]> {
    return database.getAllAutores()
  }

  static async createAutor(data: { nombre: string; nacionalidad: string }): Promise<Autor> {
    if (!data.nombre.trim() || !data.nacionalidad.trim()) {
      throw new Error("Nombre y nacionalidad son requeridos")
    }
    return database.createAutor(data)
  }

  static async deleteAutor(id: string): Promise<void> {
    const autor = database.getAutorById(id)
    if (!autor) {
      throw new Error("Autor no encontrado")
    }
    database.deleteAutor(id)
  }
}
