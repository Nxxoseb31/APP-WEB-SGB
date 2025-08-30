import { db } from "@/lib/database"
import type { Book, Author, Library } from "@/types/entities"

export class BookService {
  static create(data: {
    title: string
    year: number
    authorIds: string[]
    libraryIds: string[]
  }): Book {
    console.log("[v0] BookService.create called with:", data) // Added logging

    if (!data.title.trim()) {
      throw new Error("El título es requerido")
    }
    if (data.year < 1 || data.year > 2025) {
      throw new Error("Año de publicación inválido")
    }

    const authors =
      data.authorIds?.length > 0 ? (data.authorIds.map((id) => db.getAuthorById(id)).filter(Boolean) as Author[]) : []

    const libraries =
      data.libraryIds?.length > 0
        ? (data.libraryIds.map((id) => db.getLibraryById(id)).filter(Boolean) as Library[])
        : []

    console.log("[v0] Found authors:", authors.length, "Found libraries:", libraries.length) // Added logging

    return db.createBook({
      title: data.title,
      year: data.year,
      authors,
      libraries,
    })
  }

  static getAll(): Book[] {
    return db.getBooks()
  }

  static getById(id: string): Book | null {
    const book = db.getBookById(id)
    return book || null
  }

  static update(
    id: string,
    data: {
      title?: string
      year?: number
      authorIds?: string[]
      libraryIds?: string[]
    },
  ): Book | null {
    const updateData: any = {}

    if (data.title !== undefined) {
      if (!data.title.trim()) {
        throw new Error("El título no puede estar vacío")
      }
      updateData.title = data.title
    }

    if (data.year !== undefined) {
      if (data.year < 1 || data.year > 2025) {
        throw new Error("Año de publicación inválido")
      }
      updateData.year = data.year
    }

    if (data.authorIds !== undefined) {
      updateData.authors = data.authorIds.map((id) => db.getAuthorById(id)).filter(Boolean)
    }

    if (data.libraryIds !== undefined) {
      updateData.libraries = data.libraryIds.map((id) => db.getLibraryById(id)).filter(Boolean)
    }

    return db.updateBook(id, updateData)
  }

  static delete(id: string): boolean {
    return db.deleteBook(id)
  }
}
