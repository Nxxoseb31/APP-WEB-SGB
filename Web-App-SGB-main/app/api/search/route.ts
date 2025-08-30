import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (query.length < 1 || query.length > 20) {
      return NextResponse.json([])
    }

    const results = db.search(query)
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Error en la búsqueda" }, { status: 500 })
  }
}
