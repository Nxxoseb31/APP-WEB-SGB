import { type NextRequest, NextResponse } from "next/server"
import { BookService } from "@/services/bookService"

export async function GET() {
  try {
    const books = BookService.getAll()
    return NextResponse.json(books)
  } catch (error) {
    console.error("[v0] Error in GET /api/books:", error) // Added logging
    return NextResponse.json({ error: "Error al obtener libros" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("[v0] Creating book with data:", data) // Added logging
    const book = BookService.create(data)
    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/books:", error) // Added logging
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear libro" },
      { status: 400 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    const data = await request.json()
    const book = BookService.update(id, data)

    if (!book) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar libro" },
      { status: 400 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    const deleted = BookService.delete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar libro" }, { status: 500 })
  }
}
