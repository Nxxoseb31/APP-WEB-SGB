import { type NextRequest, NextResponse } from "next/server"
import { AutorService } from "@/services/autorService"
import type { ApiResponse, Autor, CreateAutorData } from "@/types/entities"

export async function GET(): Promise<NextResponse<ApiResponse<Autor[]>>> {
  try {
    const autores = await AutorService.getAllAutores()
    return NextResponse.json({
      success: true,
      data: autores,
      error: null,
    })
  } catch (error) {
    console.error("[v0] Error fetching autores:", error)
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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Autor>>> {
  try {
    const body: CreateAutorData = await request.json()

    const autor = await AutorService.createAutor(body)

    return NextResponse.json(
      {
        success: true,
        data: autor,
        error: null,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating autor:", error)
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
