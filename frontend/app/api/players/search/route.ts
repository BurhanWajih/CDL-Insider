import { type NextRequest, NextResponse } from "next/server"
import { searchPlayers } from "@/lib/api-services/player-service"
import type { ApiResponse, Player } from "@/lib/types"

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Player[]>>> {
  try {
    // Get query parameters
    const url = new URL(req.url)
    const query = url.searchParams.get("q") || ""
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const players = await searchPlayers(query, limit)

    return NextResponse.json({
      success: true,
      data: players,
    })
  } catch (error) {
    console.error("Error searching players:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search players",
      },
      { status: 500 },
    )
  }
}
