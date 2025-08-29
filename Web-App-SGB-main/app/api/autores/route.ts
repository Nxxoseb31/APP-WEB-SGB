import { type NextRequest, NextResponse } from "next/server"
import { AutorService } from "@/services/autorService"
import type { CreateAutorDTO } from "@/types/entities"

export async function GET() {
  try {
    const autores = await AutorService.getAllAutores()
    return NextResponse.json({ success: true, data: autores })
  } catch (error) {
    console.error("GET /api/autores error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch autores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateAutorDTO = await request.json()
    const autor = await AutorService.createAutor(body)
    return NextResponse.json({ success: true, data: autor }, { status: 201 })
  } catch (error) {
    console.error("POST /api/autores error:", error)
    const message = error instanceof Error ? error.message : "Failed to create autor"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
