import { type NextRequest, NextResponse } from "next/server"
import { BibliotecaService } from "@/services/bibliotecaService"
import type { ApiResponse, Biblioteca, CreateBibliotecaData } from "@/types/entities"

export async function GET(): Promise<NextResponse<ApiResponse<Biblioteca[]>>> {
  try {
    const bibliotecas = await BibliotecaService.getAllBibliotecas()
    return NextResponse.json({
      success: true,
      data: bibliotecas,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error fetching bibliotecas:", error)
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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Biblioteca>>> {
  try {
    const body: CreateBibliotecaData = await request.json()

    const biblioteca = await BibliotecaService.createBiblioteca(body)

    return NextResponse.json(
      {
        success: true,
        data: biblioteca,
        error: null,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating biblioteca:", error)
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
