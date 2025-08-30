import { type NextRequest, NextResponse } from "next/server"
import { LibroService } from "@/services/libroService"
import type { ApiResponse, Libro, CreateLibroData } from "@/types/entities"

export async function GET(): Promise<NextResponse<ApiResponse<Libro[]>>> {
  try {
    const libros = await LibroService.getAllLibros()
    return NextResponse.json({
      success: true,
      data: libros,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error fetching libros:", error)
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Libro>>> {
  try {
    const body: CreateLibroData = await request.json()

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
    console.error("[v0] Error creating libro:", error)
    return NextResponse.json(
      {
        success: false,
        data: {} as Libro,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 400 },
    )
  }
}
