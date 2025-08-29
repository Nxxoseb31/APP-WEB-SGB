import { db } from "@/lib/database"
import type { Biblioteca, CreateBibliotecaDTO } from "@/types/entities"

export class BibliotecaService {
  static async getAllBibliotecas(): Promise<Biblioteca[]> {
    try {
      return db.getAllBibliotecas()
    } catch (error) {
      console.error("Error fetching bibliotecas:", error)
      throw new Error("Failed to fetch bibliotecas")
    }
  }

  static async getBibliotecaById(id: string): Promise<Biblioteca | null> {
    try {
      const biblioteca = db.getBibliotecaById(id)
      return biblioteca || null
    } catch (error) {
      console.error("Error fetching biblioteca:", error)
      throw new Error("Failed to fetch biblioteca")
    }
  }

  static async createBiblioteca(data: CreateBibliotecaDTO): Promise<Biblioteca> {
    try {
      // Validation
      if (!data.nombre?.trim()) {
        throw new Error("El nombre de la biblioteca es requerido")
      }
      if (!data.ubicacion?.trim()) {
        throw new Error("La ubicación de la biblioteca es requerida")
      }

      // Validate libros if provided
      if (data.libroIds && data.libroIds.length > 0) {
        const libros = db.getAllLibros()
        const validLibroIds = data.libroIds.filter((id) => libros.some((libro) => libro.id === id))

        if (validLibroIds.length !== data.libroIds.length) {
          throw new Error("Uno o más libros no existen")
        }
      }

      // Check for duplicates
      const existingBibliotecas = db.getAllBibliotecas()
      const duplicate = existingBibliotecas.find(
        (biblioteca) => biblioteca.nombre.toLowerCase() === data.nombre.toLowerCase(),
      )

      if (duplicate) {
        throw new Error("Ya existe una biblioteca con ese nombre")
      }

      return db.createBiblioteca({
        nombre: data.nombre.trim(),
        ubicacion: data.ubicacion.trim(),
        libroIds: data.libroIds,
      })
    } catch (error) {
      console.error("Error creating biblioteca:", error)
      throw error
    }
  }

  static async searchBibliotecas(query: string): Promise<Biblioteca[]> {
    try {
      const results = db.search(query)
      return results.bibliotecas
    } catch (error) {
      console.error("Error searching bibliotecas:", error)
      throw new Error("Failed to search bibliotecas")
    }
  }
}
