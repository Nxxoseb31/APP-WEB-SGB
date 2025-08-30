import { type NextRequest, NextResponse } from "next/server"
import { BibliotecaService } from "@/services/bibliotecaService"
import type { ApiResponse, CreateBibliotecaData, Biblioteca } from "@/types/entities"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Biblioteca>>> {
  try {
    const body: CreateBibliotecaData = await request.json()
    const biblioteca = await BibliotecaService.updateBiblioteca(params.id, body)

    return NextResponse.json({
      success: true,
      data: biblioteca,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error updating biblioteca:", error)
    return NextResponse.json(
      {
        success: false,
        data: {} as Biblioteca,
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
    await BibliotecaService.deleteBiblioteca(params.id)

    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error deleting biblioteca:", error)
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
