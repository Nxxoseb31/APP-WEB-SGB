import type { Autor, Libro, Biblioteca } from "@/types/entities"

class Database {
  private autores: Autor[] = []
  private libros: Libro[] = []
  private bibliotecas: Biblioteca[] = []

  // Autores
  getAllAutores(): Autor[] {
    return [...this.autores]
  }

  createAutor(autor: Omit<Autor, "id">): Autor {
    console.log("[v0] Creating author:", autor)
    const newAutor: Autor = {
      id: Date.now().toString(),
      ...autor,
    }
    this.autores.push(newAutor)
    console.log("[v0] Author created successfully:", newAutor)
    return newAutor
  }

  deleteAutor(id: string): void {
    console.log("[v0] Attempting to delete author:", id)
    // Remove author from all books that reference them
    this.libros.forEach((libro) => {
      libro.autores = libro.autores.filter((autorId) => autorId !== id)
    })
    this.autores = this.autores.filter((autor) => autor.id !== id)
    console.log("[v0] Author deleted successfully, remaining authors:", this.autores.length)
  }

  getAutorById(id: string): Autor | undefined {
    return this.autores.find((autor) => autor.id === id)
  }

  // Libros
  getAllLibros(): Libro[] {
    return [...this.libros]
  }

  createLibro(libro: Omit<Libro, "id">): Libro {
    console.log("[v0] Creating book:", libro)
    const newLibro: Libro = {
      id: Date.now().toString(),
      ...libro,
    }
    this.libros.push(newLibro)
    console.log("[v0] Book created successfully:", newLibro)
    return newLibro
  }

  deleteLibro(id: string): void {
    console.log("[v0] Attempting to delete book:", id)
    // Remove book from all libraries
    this.bibliotecas.forEach((biblioteca) => {
      biblioteca.libros = biblioteca.libros.filter((libroId) => libroId !== id)
    })
    this.libros = this.libros.filter((libro) => libro.id !== id)
    console.log("[v0] Book deleted successfully, remaining books:", this.libros.length)
  }

  getLibroById(id: string): Libro | undefined {
    return this.libros.find((libro) => libro.id === id)
  }

  // Bibliotecas
  getAllBibliotecas(): Biblioteca[] {
    return [...this.bibliotecas]
  }

  createBiblioteca(biblioteca: Omit<Biblioteca, "id">): Biblioteca {
    console.log("[v0] Creating library:", biblioteca)
    const newBiblioteca: Biblioteca = {
      id: Date.now().toString(),
      ...biblioteca,
    }
    this.bibliotecas.push(newBiblioteca)
    console.log("[v0] Library created successfully:", newBiblioteca)
    return newBiblioteca
  }

  deleteBiblioteca(id: string): void {
    console.log("[v0] Attempting to delete library:", id)
    // Remove library reference from all books
    this.libros.forEach((libro) => {
      if (libro.biblioteca === id) {
        delete libro.biblioteca
      }
    })
    this.bibliotecas = this.bibliotecas.filter((biblioteca) => biblioteca.id !== id)
    console.log("[v0] Library deleted successfully, remaining libraries:", this.bibliotecas.length)
  }

  getBibliotecaById(id: string): Biblioteca | undefined {
    return this.bibliotecas.find((biblioteca) => biblioteca.id === id)
  }

  // Search
  search(query: string) {
    const lowerQuery = query.toLowerCase()

    const autores = this.autores.filter(
      (autor) =>
        autor.nombre.toLowerCase().includes(lowerQuery) || autor.nacionalidad.toLowerCase().includes(lowerQuery),
    )

    const libros = this.libros.filter(
      (libro) => libro.titulo.toLowerCase().includes(lowerQuery) || libro.año.toString().includes(lowerQuery),
    )

    const bibliotecas = this.bibliotecas.filter(
      (biblioteca) =>
        biblioteca.nombre.toLowerCase().includes(lowerQuery) || biblioteca.ubicacion.toLowerCase().includes(lowerQuery),
    )

    return { autores, libros, bibliotecas }
  }
}

export const database = new Database()
