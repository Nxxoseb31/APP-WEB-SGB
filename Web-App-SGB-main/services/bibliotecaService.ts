import { database } from "@/lib/database"
import type { Biblioteca, CreateBibliotecaData } from "@/types/entities"

export class BibliotecaService {
  static async getAllBibliotecas(): Promise<Biblioteca[]> {
    return database.getAllBibliotecas()
  }

  static async createBiblioteca(data: CreateBibliotecaData): Promise<Biblioteca> {
    // Validations
    if (!data.nombre?.trim()) {
      throw new Error("El nombre de la biblioteca es requerido")
    }
    if (!data.ubicacion?.trim()) {
      throw new Error("La ubicación de la biblioteca es requerida")
    }

    return database.createBiblioteca({
      nombre: data.nombre.trim(),
      ubicacion: data.ubicacion.trim(),
    })
  }

  static async deleteBiblioteca(id: string): Promise<void> {
    if (!id) {
      throw new Error("ID de la biblioteca es requerido")
    }

    const deleted = database.deleteBiblioteca(id)
    if (!deleted) {
      throw new Error("Biblioteca no encontrada")
    }
  }

  static async getBibliotecaById(id: string): Promise<Biblioteca | null> {
    const biblioteca = database.getBibliotecaById(id)
    return biblioteca || null
  }

  static async updateBiblioteca(id: string, data: CreateBibliotecaData): Promise<Biblioteca> {
    // Validations
    if (!data.nombre?.trim()) {
      throw new Error("El nombre de la biblioteca es requerido")
    }
    if (!data.ubicacion?.trim()) {
      throw new Error("La ubicación de la biblioteca es requerida")
    }

    return database.updateBiblioteca(id, {
      nombre: data.nombre.trim(),
      ubicacion: data.ubicacion.trim(),
    })
  }
}
