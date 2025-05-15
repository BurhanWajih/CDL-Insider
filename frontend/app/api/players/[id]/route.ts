import { type NextRequest, NextResponse } from "next/server"
import { getPlayerById, getPlayerStats, getDetailedPlayerStats } from "@/lib/api-services/player-service"
import type { ApiResponse, Player, PlayerSeasonStats } from "@/lib/types"

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Player & { seasonStats?: PlayerSeasonStats }>>> {
  try {
    // Access the id parameter
    const idParam = context.params.id
    const id = Number.parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid player ID",
        },
        { status: 400 },
      )
    }

    const player = await getPlayerById(id)

    if (!player) {
      return NextResponse.json(
        {
          success: false,
          error: "Player not found",
        },
        { status: 404 },
      )
    }

    // Get the season ID from query params or default to 1
    const url = new URL(req.url)
    const seasonId = Number.parseInt(url.searchParams.get("seasonId") || "1")
    const detailed = url.searchParams.get("detailed") === "true"

    // Get player stats for the specified season
    const stats = detailed ? await getDetailedPlayerStats(id, seasonId) : await getPlayerStats(id, seasonId)

    return NextResponse.json({
      success: true,
      data: {
        ...player,
        seasonStats: stats || undefined,
      },
    })
  } catch (error) {
    console.error("Error fetching player:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch player",
      },
      { status: 500 },
    )
  }
}
