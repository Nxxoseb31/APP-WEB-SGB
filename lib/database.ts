import type { Autor, Libro, Biblioteca } from "@/types/entities"

// In-memory storage (in production, this would be replaced with a real database)
class DatabaseManager {
  private autores: Map<string, Autor> = new Map()
  private libros: Map<string, Libro> = new Map()
  private bibliotecas: Map<string, Biblioteca> = new Map()

  // Initialize with sample data
  constructor() {
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Sample authors
    const autor1: Autor = {
      id: "1",
      nombre: "Gabriel García Márquez",
      nacionalidad: "Colombiano",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const autor2: Autor = {
      id: "2",
      nombre: "Isabel Allende",
      nacionalidad: "Chilena",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.autores.set(autor1.id, autor1)
    this.autores.set(autor2.id, autor2)

    // Sample library
    const biblioteca1: Biblioteca = {
      id: "1",
      nombre: "Biblioteca Central",
      ubicacion: "Centro de la ciudad",
      libros: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.bibliotecas.set(biblioteca1.id, biblioteca1)

    // Sample book
    const libro1: Libro = {
      id: "1",
      titulo: "Cien años de soledad",
      anoPublicacion: 1967,
      autores: [autor1],
      bibliotecas: [biblioteca1],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.libros.set(libro1.id, libro1)

    // Update biblioteca with the book
    biblioteca1.libros = [libro1]
    this.bibliotecas.set(biblioteca1.id, biblioteca1)
  }

  private createSerializableAutor(autor: Autor): Autor {
    return {
      id: autor.id,
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
      createdAt: autor.createdAt,
      updatedAt: autor.updatedAt,
    }
  }

  private createSerializableLibro(libro: Libro): Libro {
    return {
      id: libro.id,
      titulo: libro.titulo,
      anoPublicacion: libro.anoPublicacion,
      autores: libro.autores.map((autor) => this.createSerializableAutor(autor)),
      bibliotecas: libro.bibliotecas.map((bib) => ({
        id: bib.id,
        nombre: bib.nombre,
        ubicacion: bib.ubicacion,
        libros: [], // Avoid circular reference
        createdAt: bib.createdAt,
        updatedAt: bib.updatedAt,
      })),
      createdAt: libro.createdAt,
      updatedAt: libro.updatedAt,
    }
  }

  private createSerializableBiblioteca(biblioteca: Biblioteca): Biblioteca {
    return {
      id: biblioteca.id,
      nombre: biblioteca.nombre,
      ubicacion: biblioteca.ubicacion,
      libros: biblioteca.libros.map((libro) => ({
        id: libro.id,
        titulo: libro.titulo,
        anoPublicacion: libro.anoPublicacion,
        autores: libro.autores.map((autor) => this.createSerializableAutor(autor)),
        bibliotecas: [], // Avoid circular reference
        createdAt: libro.createdAt,
        updatedAt: libro.updatedAt,
      })),
      createdAt: biblioteca.createdAt,
      updatedAt: biblioteca.updatedAt,
    }
  }

  // Autor operations
  getAllAutores(): Autor[] {
    return Array.from(this.autores.values()).map((autor) => this.createSerializableAutor(autor))
  }

  getAutorById(id: string): Autor | undefined {
    const autor = this.autores.get(id)
    return autor ? this.createSerializableAutor(autor) : undefined
  }

  createAutor(data: { nombre: string; nacionalidad: string }): Autor {
    const id = Date.now().toString()
    const autor: Autor = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.autores.set(id, autor)
    return this.createSerializableAutor(autor)
  }

  // Libro operations
  getAllLibros(): Libro[] {
    return Array.from(this.libros.values()).map((libro) => this.createSerializableLibro(libro))
  }

  getLibroById(id: string): Libro | undefined {
    const libro = this.libros.get(id)
    return libro ? this.createSerializableLibro(libro) : undefined
  }

  createLibro(data: { titulo: string; anoPublicacion: number; autorIds: string[]; bibliotecaIds?: string[] }): Libro {
    const id = Date.now().toString()
    const autores = data.autorIds.map((autorId) => this.autores.get(autorId)).filter(Boolean) as Autor[]
    const bibliotecas =
      (data.bibliotecaIds?.map((bibId) => this.bibliotecas.get(bibId)).filter(Boolean) as Biblioteca[]) || []

    const libro: Libro = {
      id,
      titulo: data.titulo,
      anoPublicacion: data.anoPublicacion,
      autores,
      bibliotecas,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.libros.set(id, libro)

    // Update bibliotecas to include this book
    bibliotecas.forEach((biblioteca) => {
      if (!biblioteca.libros.some((l) => l.id === libro.id)) {
        biblioteca.libros.push(libro)
        this.bibliotecas.set(biblioteca.id, biblioteca)
      }
    })

    return this.createSerializableLibro(libro)
  }

  // Biblioteca operations
  getAllBibliotecas(): Biblioteca[] {
    return Array.from(this.bibliotecas.values()).map((biblioteca) => this.createSerializableBiblioteca(biblioteca))
  }

  getBibliotecaById(id: string): Biblioteca | undefined {
    const biblioteca = this.bibliotecas.get(id)
    return biblioteca ? this.createSerializableBiblioteca(biblioteca) : undefined
  }

  createBiblioteca(data: { nombre: string; ubicacion: string; libroIds?: string[] }): Biblioteca {
    const id = Date.now().toString()
    const libros = (data.libroIds?.map((libroId) => this.libros.get(libroId)).filter(Boolean) as Libro[]) || []

    const biblioteca: Biblioteca = {
      id,
      nombre: data.nombre,
      ubicacion: data.ubicacion,
      libros,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.bibliotecas.set(id, biblioteca)

    // Update libros to include this biblioteca
    libros.forEach((libro) => {
      if (!libro.bibliotecas.some((b) => b.id === biblioteca.id)) {
        libro.bibliotecas.push(biblioteca)
        this.libros.set(libro.id, libro)
      }
    })

    return this.createSerializableBiblioteca(biblioteca)
  }

  // Search functionality
  search(query: string): { autores: Autor[]; libros: Libro[]; bibliotecas: Biblioteca[] } {
    const searchTerm = query.toLowerCase()

    const autores = this.getAllAutores().filter(
      (autor) =>
        autor.nombre.toLowerCase().includes(searchTerm) || autor.nacionalidad.toLowerCase().includes(searchTerm),
    )

    const libros = this.getAllLibros().filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(searchTerm) ||
        libro.autores.some((autor) => autor.nombre.toLowerCase().includes(searchTerm)) ||
        libro.anoPublicacion.toString().includes(searchTerm),
    )

    const bibliotecas = this.getAllBibliotecas().filter(
      (biblioteca) =>
        biblioteca.nombre.toLowerCase().includes(searchTerm) || biblioteca.ubicacion.toLowerCase().includes(searchTerm),
    )

    return { autores, libros, bibliotecas }
  }
}

// Singleton instance
export const db = new DatabaseManager()
