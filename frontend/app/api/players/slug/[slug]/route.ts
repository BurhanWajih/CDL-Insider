import { type NextRequest, NextResponse } from "next/server"
import { getPlayerBySlug, getPlayerStats } from "@/lib/api-services/player-service"
import type { ApiResponse, Player, PlayerSeasonStats } from "@/lib/types"

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } },
): Promise<NextResponse<ApiResponse<Player & { seasonStats?: PlayerSeasonStats }>>> {
  try {
    // Access the slug parameter
    const slugParam = context.params.slug

    const player = await getPlayerBySlug(slugParam)

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

    // Get player stats for the specified season
    const stats = await getPlayerStats(player.id, seasonId)

    return NextResponse.json({
      success: true,
      data: {
        ...player,
        seasonStats: stats || undefined,
      },
    })
  } catch (error) {
    console.error("Error fetching player by slug:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch player",
      },
      { status: 500 },
    )
  }
}
