import { type NextRequest, NextResponse } from "next/server"
import { getAllTeams } from "@/lib/api-services/team-service"
import type { ApiResponse, Team } from "@/lib/types"

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Team[]>>> {
  try {
    const teams = await getAllTeams()

    return NextResponse.json({
      success: true,
      data: teams,
    })
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch teams",
      },
      { status: 500 },
    )
  }
}
