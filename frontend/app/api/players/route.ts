import { type NextRequest, NextResponse } from "next/server"
import { getAllPlayers } from "@/lib/api-services/player-service"
import type { ApiResponse, Player } from "@/lib/types"

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Player[]>>> {
  try {
    const players = await getAllPlayers()

    return NextResponse.json({
      success: true,
      data: players,
    })
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch players",
      },
      { status: 500 },
    )
  }
}
