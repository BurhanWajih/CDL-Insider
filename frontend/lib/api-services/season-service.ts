import { executeQuery } from "@/lib/db"
import type { Season } from "@/lib/types"

export async function getAllSeasons(): Promise<Season[]> {
  const query = `
    SELECT * FROM season
    ORDER BY year DESC
  `

  return await executeQuery<Season[]>(query)
}

export async function getCurrentSeason(): Promise<Season | null> {
  const query = `
    SELECT * FROM season
    ORDER BY year DESC
    LIMIT 1
  `

  const seasons = await executeQuery<Season[]>(query)

  if (seasons.length === 0) {
    return null
  }

  return seasons[0]
}

export async function getSeasonById(id: number): Promise<Season | null> {
  const query = `
    SELECT * FROM season
    WHERE id = ?
  `

  const seasons = await executeQuery<Season[]>(query, [id])

  if (seasons.length === 0) {
    return null
  }

  return seasons[0]
}
