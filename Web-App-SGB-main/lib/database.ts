import type { Autor, Libro, Biblioteca } from "@/types/entities"

class InMemoryDatabase {
  private autores: Map<string, Autor> = new Map()
  private libros: Map<string, Libro> = new Map()
  private bibliotecas: Map<string, Biblioteca> = new Map()

  constructor() {
    this.seedData()
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  private seedData() {
    // Database now starts empty - no pre-established data
  }

  // Autor operations
  getAllAutores(): Autor[] {
    const autores = Array.from(this.autores.values())
    return autores
  }

  getAutorById(id: string): Autor | undefined {
    return this.autores.get(id)
  }

  createAutor(data: { nombre: string; nacionalidad: string }): Autor {
    const autor: Autor = {
      id: this.generateId(),
      nombre: data.nombre,
      nacionalidad: data.nacionalidad,
      fechaRegistro: this.getCurrentDate(),
    }
    this.autores.set(autor.id, autor)
    return autor
  }

  updateAutor(id: string, data: { nombre: string; nacionalidad: string }): Autor {
    const autor = this.autores.get(id)
    if (!autor) {
      throw new Error("Autor no encontrado")
    }

    const updatedAutor: Autor = {
      ...autor,
      nombre: data.nombre,
      nacionalidad: data.nacionalidad,
    }

    this.autores.set(id, updatedAutor)
    return updatedAutor
  }

  deleteAutor(id: string): boolean {
    // Check if author has associated books
    const hasBooks = Array.from(this.libros.values()).some((libro) => libro.autores.includes(id))

    if (hasBooks) {
      throw new Error("No se puede eliminar el autor porque tiene libros asociados")
    }

    return this.autores.delete(id)
  }

  // Libro operations
  getAllLibros(): Libro[] {
    return Array.from(this.libros.values())
  }

  getLibroById(id: string): Libro | undefined {
    return this.libros.get(id)
  }

  createLibro(data: { titulo: string; año: number; autores: string[]; bibliotecas?: string[] }): Libro {
    // Validate authors exist
    for (const autorId of data.autores) {
      if (!this.autores.has(autorId)) {
        throw new Error(`Autor con ID ${autorId} no existe`)
      }
    }

    // Validate libraries exist if provided
    if (data.bibliotecas) {
      for (const bibliotecaId of data.bibliotecas) {
        if (!this.bibliotecas.has(bibliotecaId)) {
          throw new Error(`Biblioteca con ID ${bibliotecaId} no existe`)
        }
      }
    }

    const libro: Libro = {
      id: this.generateId(),
      titulo: data.titulo,
      año: data.año,
      autores: data.autores,
      bibliotecas: data.bibliotecas || [],
      fechaRegistro: this.getCurrentDate(),
    }

    this.libros.set(libro.id, libro)

    // Update library references
    if (data.bibliotecas) {
      for (const bibliotecaId of data.bibliotecas) {
        const biblioteca = this.bibliotecas.get(bibliotecaId)
        if (biblioteca) {
          biblioteca.libros = biblioteca.libros || []
          if (!biblioteca.libros.includes(libro.id)) {
            biblioteca.libros.push(libro.id)
          }
        }
      }
    }

    return libro
  }

  updateLibro(id: string, data: { titulo: string; año: number; autores: string[]; bibliotecas?: string[] }): Libro {
    const libro = this.libros.get(id)
    if (!libro) {
      throw new Error("Libro no encontrado")
    }

    // Validate authors exist
    for (const autorId of data.autores) {
      if (!this.autores.has(autorId)) {
        throw new Error(`Autor con ID ${autorId} no existe`)
      }
    }

    // Validate libraries exist if provided
    if (data.bibliotecas) {
      for (const bibliotecaId of data.bibliotecas) {
        if (!this.bibliotecas.has(bibliotecaId)) {
          throw new Error(`Biblioteca con ID ${bibliotecaId} no existe`)
        }
      }
    }

    // Remove old library references
    if (libro.bibliotecas) {
      for (const bibliotecaId of libro.bibliotecas) {
        const biblioteca = this.bibliotecas.get(bibliotecaId)
        if (biblioteca && biblioteca.libros) {
          biblioteca.libros = biblioteca.libros.filter((libroId) => libroId !== id)
        }
      }
    }

    const updatedLibro: Libro = {
      ...libro,
      titulo: data.titulo,
      año: data.año,
      autores: data.autores,
      bibliotecas: data.bibliotecas || [],
    }

    this.libros.set(id, updatedLibro)

    // Update new library references
    if (data.bibliotecas) {
      for (const bibliotecaId of data.bibliotecas) {
        const biblioteca = this.bibliotecas.get(bibliotecaId)
        if (biblioteca) {
          biblioteca.libros = biblioteca.libros || []
          if (!biblioteca.libros.includes(id)) {
            biblioteca.libros.push(id)
          }
        }
      }
    }

    return updatedLibro
  }

  deleteLibro(id: string): boolean {
    const libro = this.libros.get(id)
    if (!libro) return false

    // Remove book references from libraries
    if (libro.bibliotecas) {
      for (const bibliotecaId of libro.bibliotecas) {
        const biblioteca = this.bibliotecas.get(bibliotecaId)
        if (biblioteca && biblioteca.libros) {
          biblioteca.libros = biblioteca.libros.filter((libroId) => libroId !== id)
        }
      }
    }

    return this.libros.delete(id)
  }

  // Biblioteca operations
  getAllBibliotecas(): Biblioteca[] {
    return Array.from(this.bibliotecas.values())
  }

  getBibliotecaById(id: string): Biblioteca | undefined {
    return this.bibliotecas.get(id)
  }

  createBiblioteca(data: { nombre: string; ubicacion: string }): Biblioteca {
    const biblioteca: Biblioteca = {
      id: this.generateId(),
      nombre: data.nombre,
      ubicacion: data.ubicacion,
      libros: [],
      fechaRegistro: this.getCurrentDate(),
    }
    this.bibliotecas.set(biblioteca.id, biblioteca)
    return biblioteca
  }

  updateBiblioteca(id: string, data: { nombre: string; ubicacion: string }): Biblioteca {
    const biblioteca = this.bibliotecas.get(id)
    if (!biblioteca) {
      throw new Error("Biblioteca no encontrada")
    }

    const updatedBiblioteca: Biblioteca = {
      ...biblioteca,
      nombre: data.nombre,
      ubicacion: data.ubicacion,
    }

    this.bibliotecas.set(id, updatedBiblioteca)
    return updatedBiblioteca
  }

  deleteBiblioteca(id: string): boolean {
    const biblioteca = this.bibliotecas.get(id)
    if (!biblioteca) return false

    // Remove library references from books
    if (biblioteca.libros) {
      for (const libroId of biblioteca.libros) {
        const libro = this.libros.get(libroId)
        if (libro && libro.bibliotecas) {
          libro.bibliotecas = libro.bibliotecas.filter((bibliotecaId) => bibliotecaId !== id)
        }
      }
    }

    return this.bibliotecas.delete(id)
  }

  // Search operations
  search(query: string): { autores: Autor[]; libros: Libro[]; bibliotecas: Biblioteca[] } {
    const searchTerm = query.toLowerCase()

    const autores = Array.from(this.autores.values()).filter(
      (autor) =>
        autor.nombre.toLowerCase().includes(searchTerm) || autor.nacionalidad.toLowerCase().includes(searchTerm),
    )

    const libros = Array.from(this.libros.values()).filter((libro) => {
      const autorNames = libro.autores
        .map((autorId) => {
          const autor = this.autores.get(autorId)
          return autor ? autor.nombre.toLowerCase() : ""
        })
        .join(" ")

      return (
        libro.titulo.toLowerCase().includes(searchTerm) ||
        libro.año.toString().includes(searchTerm) ||
        autorNames.includes(searchTerm)
      )
    })

    const bibliotecas = Array.from(this.bibliotecas.values()).filter(
      (biblioteca) =>
        biblioteca.nombre.toLowerCase().includes(searchTerm) || biblioteca.ubicacion.toLowerCase().includes(searchTerm),
    )

    return { autores, libros, bibliotecas }
  }
}

// Singleton instance
export const database = new InMemoryDatabase()
