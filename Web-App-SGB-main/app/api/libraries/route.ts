import { type NextRequest, NextResponse } from "next/server"
import { LibraryService } from "@/services/libraryService"

export async function GET() {
  try {
    const libraries = LibraryService.getAll()
    return NextResponse.json(libraries)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener bibliotecas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const library = LibraryService.create(data)
    return NextResponse.json(library, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear biblioteca" },
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
    const library = LibraryService.update(id, data)

    if (!library) {
      return NextResponse.json({ error: "Biblioteca no encontrada" }, { status: 404 })
    }

    return NextResponse.json(library)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar biblioteca" },
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

    const deleted = LibraryService.delete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Biblioteca no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar biblioteca" }, { status: 500 })
  }
}
