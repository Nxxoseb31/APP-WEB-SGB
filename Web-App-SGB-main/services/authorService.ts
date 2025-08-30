import { db } from "@/lib/database"
import type { Author } from "@/types/entities"

export class AuthorService {
  static create(data: { name: string; nationality: string }): Author {
    if (!data.name.trim() || !data.nationality.trim()) {
      throw new Error("Nombre y nacionalidad son requeridos")
    }
    return db.createAuthor(data)
  }

  static getAll(): Author[] {
    return db.getAuthors()
  }

  static getById(id: string): Author | null {
    const author = db.getAuthorById(id)
    return author || null
  }

  static update(id: string, data: { name?: string; nationality?: string }): Author | null {
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error("El nombre no puede estar vacío")
    }
    if (data.nationality !== undefined && !data.nationality.trim()) {
      throw new Error("La nacionalidad no puede estar vacía")
    }
    return db.updateAuthor(id, data)
  }

  static delete(id: string): boolean {
    return db.deleteAuthor(id)
  }
}
