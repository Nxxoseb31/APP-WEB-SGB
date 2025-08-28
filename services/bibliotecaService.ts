import { database } from "@/lib/database"
import type { Biblioteca } from "@/types/entities"

export class BibliotecaService {
  static async getAllBibliotecas(): Promise<Biblioteca[]> {
    return database.getAllBibliotecas()
  }

  static async createBiblioteca(data: { nombre: string; ubicacion: string; libros?: string[] }): Promise<Biblioteca> {
    if (!data.nombre.trim() || !data.ubicacion.trim()) {
      throw new Error("Nombre y ubicación son requeridos")
    }

    const bibliotecaData = {
      nombre: data.nombre,
      ubicacion: data.ubicacion,
      libros: data.libros || [],
    }

    return database.createBiblioteca(bibliotecaData)
  }

  static async deleteBiblioteca(id: string): Promise<void> {
    const biblioteca = database.getBibliotecaById(id)
    if (!biblioteca) {
      throw new Error("Biblioteca no encontrada")
    }
    database.deleteBiblioteca(id)
  }
}
