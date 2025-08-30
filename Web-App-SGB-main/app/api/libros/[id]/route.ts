import { type NextRequest, NextResponse } from "next/server"
import { LibroService } from "@/services/libroService"
import type { ApiResponse, CreateLibroData, Libro } from "@/types/entities"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Libro>>> {
  try {
    const body: CreateLibroData = await request.json()
    const libro = await LibroService.updateLibro(params.id, body)

    return NextResponse.json({
      success: true,
      data: libro,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error updating libro:", error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    await LibroService.deleteLibro(params.id)

    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error deleting libro:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 404 },
    )
  }
}
