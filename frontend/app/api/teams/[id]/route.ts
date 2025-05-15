import { type NextRequest, NextResponse } from "next/server"
import { getTeamById, getTeamPlayers } from "@/lib/api-services/team-service"
import type { ApiResponse, Team, Player } from "@/lib/types"

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Team & { players?: Player[] }>>> {
  try {
    // Access the id parameter
    const idParam = context.params.id
    const id = Number.parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid team ID",
        },
        { status: 400 },
      )
    }

    const team = await getTeamById(id)

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
    const players = await getTeamPlayers(id)

    return NextResponse.json({
      success: true,
      data: {
        ...team,
        players,
      },
    })
  } catch (error) {
    console.error("Error fetching team:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team",
      },
      { status: 500 },
    )
  }
}
