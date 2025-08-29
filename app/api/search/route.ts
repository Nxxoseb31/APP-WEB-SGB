import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 })
    }

    const results = db.search(query.trim())
    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error("GET /api/search error:", error)
    return NextResponse.json({ success: false, error: "Failed to perform search" }, { status: 500 })
  }
}
