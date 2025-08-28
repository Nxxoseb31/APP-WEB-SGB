import { type NextRequest, NextResponse } from "next/server"
import { BibliotecaService } from "@/services/bibliotecaService"

export async function GET() {
  try {
    const bibliotecas = await BibliotecaService.getAllBibliotecas()
    return NextResponse.json({
      success: true,
      data: bibliotecas,
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
