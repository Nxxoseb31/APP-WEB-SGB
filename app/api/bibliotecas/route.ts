import { type NextRequest, NextResponse } from "next/server"
import { BibliotecaService } from "@/services/bibliotecaService"
import type { CreateBibliotecaDTO } from "@/types/entities"

export async function GET() {
  try {
    const bibliotecas = await BibliotecaService.getAllBibliotecas()
    return NextResponse.json({ success: true, data: bibliotecas })
  } catch (error) {
    console.error("GET /api/bibliotecas error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bibliotecas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBibliotecaDTO = await request.json()
    const biblioteca = await BibliotecaService.createBiblioteca(body)
    return NextResponse.json({ success: true, data: biblioteca }, { status: 201 })
  } catch (error) {
    console.error("POST /api/bibliotecas error:", error)
    const message = error instanceof Error ? error.message : "Failed to create biblioteca"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
