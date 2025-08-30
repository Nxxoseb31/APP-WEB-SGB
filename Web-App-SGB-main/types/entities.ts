export interface Author {
  id: string
  name: string
  nationality: string
  createdAt: Date
}

export interface Book {
  id: string
  title: string
  year: number
  authors: Author[]
  libraries: Library[]
  createdAt: Date
}

export interface Library {
  id: string
  name: string
  location: string
  books: Book[]
  createdAt: Date
}

export interface SearchResult {
  type: "author" | "book" | "library"
  id: string
  title: string
  subtitle: string
  data: Author | Book | Library
}
