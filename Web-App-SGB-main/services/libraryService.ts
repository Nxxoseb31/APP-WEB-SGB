import { db } from "@/lib/database"
import type { Library } from "@/types/entities"

export class LibraryService {
  static create(data: { name: string; location: string }): Library {
    if (!data.name.trim() || !data.location.trim()) {
      throw new Error("Nombre y ubicación son requeridos")
    }
    return db.createLibrary(data)
  }

  static getAll(): Library[] {
    return db.getLibraries()
  }

  static getById(id: string): Library | null {
    const library = db.getLibraryById(id)
    return library || null
  }

  static update(id: string, data: { name?: string; location?: string }): Library | null {
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error("El nombre no puede estar vacío")
    }
    if (data.location !== undefined && !data.location.trim()) {
      throw new Error("La ubicación no puede estar vacía")
    }
    return db.updateLibrary(id, data)
  }

  static delete(id: string): boolean {
    return db.deleteLibrary(id)
  }
}
