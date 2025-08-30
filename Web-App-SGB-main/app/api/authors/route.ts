import { type NextRequest, NextResponse } from "next/server"
import { AuthorService } from "@/services/authorService"

export async function GET() {
  try {
    const authors = AuthorService.getAll()
    return NextResponse.json(authors)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener autores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const author = AuthorService.create(data)
    return NextResponse.json(author, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear autor" },
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
    const author = AuthorService.update(id, data)

    if (!author) {
      return NextResponse.json({ error: "Autor no encontrado" }, { status: 404 })
    }

    return NextResponse.json(author)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar autor" },
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

    const deleted = AuthorService.delete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Autor no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar autor" }, { status: 500 })
  }
}
