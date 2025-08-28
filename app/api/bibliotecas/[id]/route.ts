import { type NextRequest, NextResponse } from "next/server"
import { BibliotecaService } from "@/services/bibliotecaService"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await BibliotecaService.deleteBiblioteca(params.id)
    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    })
  } catch (error) {
    const status = error instanceof Error && error.message.includes("no encontrada") ? 404 : 500
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
