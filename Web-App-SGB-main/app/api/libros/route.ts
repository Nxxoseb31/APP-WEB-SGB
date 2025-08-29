import { type NextRequest, NextResponse } from "next/server"
import { LibroService } from "@/services/libroService"
import type { CreateLibroDTO } from "@/types/entities"

export async function GET() {
  try {
    const libros = await LibroService.getAllLibros()
    return NextResponse.json({ success: true, data: libros })
  } catch (error) {
    console.error("GET /api/libros error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch libros" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLibroDTO = await request.json()
    const libro = await LibroService.createLibro(body)
    return NextResponse.json({ success: true, data: libro }, { status: 201 })
  } catch (error) {
    console.error("POST /api/libros error:", error)
    const message = error instanceof Error ? error.message : "Failed to create libro"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
