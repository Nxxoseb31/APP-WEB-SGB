import { type NextRequest, NextResponse } from "next/server"
import { AutorService } from "@/services/autorService"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await AutorService.deleteAutor(params.id)
    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    })
  } catch (error) {
    const status =
      error instanceof Error && error.message.includes("no encontrado")
        ? 404
        : error instanceof Error && error.message.includes("libros asociados")
          ? 409
          : 500
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
