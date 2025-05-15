import { type NextRequest, NextResponse } from "next/server"
import { getCurrentSeason } from "@/lib/api-services/season-service"
import type { ApiResponse, Season } from "@/lib/types"

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Season>>> {
  try {
    const season = await getCurrentSeason()

    if (!season) {
      return NextResponse.json(
        {
          success: false,
          error: "No seasons found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: season,
    })
  } catch (error) {
    console.error("Error fetching current season:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch current season",
      },
      { status: 500 },
    )
  }
}
