import { type NextRequest, NextResponse } from "next/server"
import { getTeamStandings } from "@/lib/api-services/team-service"
import type { ApiResponse, PaginatedResponse, Team } from "@/lib/types"

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<PaginatedResponse<Team & { stats: any }>>>> {
  try {
    // Get the season ID from query params or default to 1
    const url = new URL(req.url)
    const seasonId = Number.parseInt(url.searchParams.get("seasonId") || "1")

    const standings = await getTeamStandings(seasonId)

    return NextResponse.json({
      success: true,
      data: standings,
    })
  } catch (error) {
    console.error("Error fetching team standings:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team standings",
      },
      { status: 500 },
    )
  }
}
