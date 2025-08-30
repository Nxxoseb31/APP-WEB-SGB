import { type NextRequest, NextResponse } from "next/server"
import { AutorService } from "@/services/autorService"
import type { ApiResponse, CreateAutorData, Autor } from "@/types/entities"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Autor>>> {
  try {
    const body: CreateAutorData = await request.json()
    const autor = await AutorService.updateAutor(params.id, body)

    return NextResponse.json({
      success: true,
      data: autor,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error updating autor:", error)
    return NextResponse.json(
      {
        success: false,
        data: {} as Autor,
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
    await AutorService.deleteAutor(params.id)

    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error deleting autor:", error)
    const statusCode = error instanceof Error && error.message.includes("libros asociados") ? 409 : 404

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: statusCode },
    )
  }
}
