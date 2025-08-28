import { type NextRequest, NextResponse } from "next/server"
import { AutorService } from "@/services/autorService"

export async function GET() {
  try {
    const autores = await AutorService.getAllAutores()
    return NextResponse.json({
      success: true,
      data: autores,
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
