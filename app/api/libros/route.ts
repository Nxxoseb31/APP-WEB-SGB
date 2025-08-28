import { type NextRequest, NextResponse } from "next/server"
import { LibroService } from "@/services/libroService"

export async function GET() {
  try {
    const libros = await LibroService.getAllLibros()
    return NextResponse.json({
      success: true,
      data: libros,
      error: null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const libro = await LibroService.createLibro(body)
    return NextResponse.json(
      {
        success: true,
        data: libro,
        error: null,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 400 },
    )
  }
}
