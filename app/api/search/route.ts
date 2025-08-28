import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({
        success: true,
        data: { autores: [], libros: [], bibliotecas: [] },
        error: null,
      })
    }

    const results = database.search(query)
    return NextResponse.json({
      success: true,
      data: results,
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
