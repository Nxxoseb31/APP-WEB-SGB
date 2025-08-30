import type { Author, Book, Library, SearchResult } from "./types" // Assuming these types are declared in a separate file

// Simulador de base de datos en memoria para el ejemplo
class InMemoryDatabase {
  private authors: Author[] = []
  private books: Book[] = []
  private libraries: Library[] = []

  // Authors CRUD
  createAuthor(author: Omit<Author, "id" | "createdAt">): Author {
    const newAuthor: Author = {
      ...author,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    this.authors.push(newAuthor)
    return newAuthor
  }

  getAuthors(): Author[] {
    return [...this.authors]
  }

  getAuthorById(id: string): Author | undefined {
    return this.authors.find((author) => author.id === id)
  }

  updateAuthor(id: string, updates: Partial<Omit<Author, "id" | "createdAt">>): Author | null {
    const index = this.authors.findIndex((author) => author.id === id)
    if (index === -1) return null

    this.authors[index] = { ...this.authors[index], ...updates }

    // Actualizar referencias en libros
    this.books.forEach((book) => {
      const authorIndex = book.authors.findIndex((author) => author.id === id)
      if (authorIndex !== -1) {
        book.authors[authorIndex] = this.authors[index]
      }
    })

    return this.authors[index]
  }

  deleteAuthor(id: string): boolean {
    const index = this.authors.findIndex((author) => author.id === id)
    if (index === -1) return false

    // Remover de todos los libros
    this.books.forEach((book) => {
      book.authors = book.authors.filter((author) => author.id !== id)
    })

    this.authors.splice(index, 1)
    return true
  }

  // Books CRUD
  createBook(book: Omit<Book, "id" | "createdAt">): Book {
    const cleanAuthors = book.authors.map((author) => ({
      id: author.id,
      name: author.name,
      nationality: author.nationality,
      createdAt: author.createdAt,
    }))

    const cleanLibraries = book.libraries.map((library) => ({
      id: library.id,
      name: library.name,
      location: library.location,
      createdAt: library.createdAt,
    }))

    const newBook: Book = {
      id: crypto.randomUUID(),
      title: book.title,
      year: book.year,
      authors: cleanAuthors,
      libraries: cleanLibraries,
      createdAt: new Date(),
    }
    this.books.push(newBook)

    cleanLibraries.forEach((library) => {
      const libraryIndex = this.libraries.findIndex((lib) => lib.id === library.id)
      if (libraryIndex !== -1) {
        const cleanBookForLibrary = {
          id: newBook.id,
          title: newBook.title,
          year: newBook.year,
          authors: cleanAuthors,
          libraries: [], // Avoid circular reference
          createdAt: newBook.createdAt,
        }
        this.libraries[libraryIndex].books.push(cleanBookForLibrary)
      }
    })

    return newBook
  }

  getBooks(): Book[] {
    return this.books.map((book) => ({
      id: book.id,
      title: book.title,
      year: book.year,
      authors: book.authors.map((author) => ({
        id: author.id,
        name: author.name,
        nationality: author.nationality,
        createdAt: author.createdAt,
      })),
      libraries: book.libraries.map((library) => ({
        id: library.id,
        name: library.name,
        location: library.location,
        createdAt: library.createdAt,
      })),
      createdAt: book.createdAt,
    }))
  }

  getBookById(id: string): Book | undefined {
    return this.books.find((book) => book.id === id)
  }

  updateBook(id: string, updates: Partial<Omit<Book, "id" | "createdAt">>): Book | null {
    const index = this.books.findIndex((book) => book.id === id)
    if (index === -1) return null

    const oldBook = this.books[index]

    const cleanUpdates: any = {}

    if (updates.title !== undefined) cleanUpdates.title = updates.title
    if (updates.year !== undefined) cleanUpdates.year = updates.year

    if (updates.authors !== undefined) {
      cleanUpdates.authors = updates.authors.map((author) => ({
        id: author.id,
        name: author.name,
        nationality: author.nationality,
        createdAt: author.createdAt,
      }))
    }

    if (updates.libraries !== undefined) {
      cleanUpdates.libraries = updates.libraries.map((library) => ({
        id: library.id,
        name: library.name,
        location: library.location,
        createdAt: library.createdAt,
      }))
    }

    this.books[index] = { ...oldBook, ...cleanUpdates }

    if (updates.libraries) {
      // Remove from previous libraries
      this.libraries.forEach((library) => {
        library.books = library.books.filter((book) => book.id !== id)
      })

      // Add to new libraries
      cleanUpdates.libraries.forEach((library: any) => {
        const libraryIndex = this.libraries.findIndex((lib) => lib.id === library.id)
        if (libraryIndex !== -1) {
          const cleanBookForLibrary = {
            id: this.books[index].id,
            title: this.books[index].title,
            year: this.books[index].year,
            authors: cleanUpdates.authors || this.books[index].authors,
            libraries: [], // Avoid circular reference
            createdAt: this.books[index].createdAt,
          }
          this.libraries[libraryIndex].books.push(cleanBookForLibrary)
        }
      })
    }

    return this.books[index]
  }

  deleteBook(id: string): boolean {
    const index = this.books.findIndex((book) => book.id === id)
    if (index === -1) return false

    // Remover de todas las bibliotecas
    this.libraries.forEach((library) => {
      library.books = library.books.filter((book) => book.id !== id)
    })

    this.books.splice(index, 1)
    return true
  }

  // Libraries CRUD
  createLibrary(library: Omit<Library, "id" | "createdAt" | "books">): Library {
    const newLibrary: Library = {
      ...library,
      id: crypto.randomUUID(),
      books: [],
      createdAt: new Date(),
    }
    this.libraries.push(newLibrary)
    return newLibrary
  }

  getLibraries(): Library[] {
    return this.libraries.map((library) => ({
      id: library.id,
      name: library.name,
      location: library.location,
      books: library.books.map((book) => ({
        id: book.id,
        title: book.title,
        year: book.year,
        authors: book.authors,
        libraries: [], // Avoid circular reference
        createdAt: book.createdAt,
      })),
      createdAt: library.createdAt,
    }))
  }

  getLibraryById(id: string): Library | undefined {
    return this.libraries.find((library) => library.id === id)
  }

  updateLibrary(id: string, updates: Partial<Omit<Library, "id" | "createdAt" | "books">>): Library | null {
    const index = this.libraries.findIndex((library) => library.id === id)
    if (index === -1) return null

    this.libraries[index] = { ...this.libraries[index], ...updates }

    // Actualizar referencias en libros
    this.books.forEach((book) => {
      const libraryIndex = book.libraries.findIndex((library) => library.id === id)
      if (libraryIndex !== -1) {
        book.libraries[libraryIndex] = this.libraries[index]
      }
    })

    return this.libraries[index]
  }

  deleteLibrary(id: string): boolean {
    const index = this.libraries.findIndex((library) => library.id === id)
    if (index === -1) return false

    // Remover de todos los libros
    this.books.forEach((book) => {
      book.libraries = book.libraries.filter((library) => library.id !== id)
    })

    this.libraries.splice(index, 1)
    return true
  }

  // Search
  search(query: string): SearchResult[] {
    if (query.length < 1 || query.length > 20) return []

    const results: SearchResult[] = []
    const lowerQuery = query.toLowerCase()

    // Buscar autores
    this.authors.forEach((author) => {
      if (author.name.toLowerCase().includes(lowerQuery) || author.nationality.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "author",
          id: author.id,
          title: author.name,
          subtitle: author.nationality,
          data: author,
        })
      }
    })

    // Buscar libros
    this.books.forEach((book) => {
      if (book.title.toLowerCase().includes(lowerQuery) || book.year.toString().includes(query)) {
        results.push({
          type: "book",
          id: book.id,
          title: book.title,
          subtitle: `${book.year} - ${book.authors.map((a) => a.name).join(", ")}`,
          data: book,
        })
      }
    })

    // Buscar bibliotecas
    this.libraries.forEach((library) => {
      if (library.name.toLowerCase().includes(lowerQuery) || library.location.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "library",
          id: library.id,
          title: library.name,
          subtitle: library.location,
          data: library,
        })
      }
    })

    return results
  }
}

export const db = new InMemoryDatabase()
