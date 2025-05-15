import { type NextRequest, NextResponse } from "next/server"
import { getTopPlayersByCategory } from "@/lib/api-services/player-service"
import type { ApiResponse, PaginatedResponse, Player, StatCategory } from "@/lib/types"

export async function GET(
  req: NextRequest,
  context: { params: { category: string } },
): Promise<NextResponse<ApiResponse<PaginatedResponse<Player & { statValue: number }>>>> {
  try {
    // Access the category parameter
    const categoryParam = context.params.category

    // Validate category
    const validCategories: StatCategory[] = ["overall", "hardpoint", "search", "control"]
    if (!validCategories.includes(categoryParam as StatCategory)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category",
        },
        { status: 400 },
      )
    }

    // Get query parameters
    const url = new URL(req.url)
    const seasonId = Number.parseInt(url.searchParams.get("seasonId") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const search = url.searchParams.get("search") || ""

    const result = await getTopPlayersByCategory(categoryParam as StatCategory, seasonId, limit, page, search)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching top players:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch top players",
      },
      { status: 500 },
    )
  }
}
