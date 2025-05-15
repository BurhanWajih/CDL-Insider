import { type NextRequest, NextResponse } from "next/server"
import { getAllSeasons } from "@/lib/api-services/season-service"
import type { ApiResponse, Season } from "@/lib/types"

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Season[]>>> {
  try {
    const seasons = await getAllSeasons()

    return NextResponse.json({
      success: true,
      data: seasons,
    })
  } catch (error) {
    console.error("Error fetching seasons:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch seasons",
      },
      { status: 500 },
    )
  }
}
