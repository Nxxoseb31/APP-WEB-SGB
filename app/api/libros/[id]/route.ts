import { type NextRequest, NextResponse } from "next/server"
import { LibroService } from "@/services/libroService"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await LibroService.deleteLibro(params.id)
    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    })
  } catch (error) {
    const status = error instanceof Error && error.message.includes("no encontrado") ? 404 : 500
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status },
    )
  }
}
