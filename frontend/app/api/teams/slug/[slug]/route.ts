import { type NextRequest, NextResponse } from "next/server"
import { getTeamBySlug, getTeamPlayers, getTeamDetailedStats } from "@/lib/api-services/team-service"
import type { ApiResponse, Team, Player } from "@/lib/types"

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } },
): Promise<NextResponse<ApiResponse<Team & { players?: Player[]; stats?: any }>>> {
  try {
    // Access the slug parameter
    const slugParam = context.params.slug

    const team = await getTeamBySlug(slugParam)

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          error: "Team not found",
        },
        { status: 404 },
      )
    }

    // Get team players
    const players = await getTeamPlayers(team.id)

    // Check if detailed stats are requested
    const url = new URL(req.url)
    const detailed = url.searchParams.get("detailed") === "true"

    // Get detailed stats if requested
    const stats = detailed ? await getTeamDetailedStats(team.id) : null

    return NextResponse.json({
      success: true,
      data: {
        ...team,
        players,
        stats: stats || undefined,
      },
    })
  } catch (error) {
    console.error("Error fetching team by slug:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team",
      },
      { status: 500 },
    )
  }
}
