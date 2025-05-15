import { executeQuery } from "@/lib/db"
import type { Player, PlayerSeasonStats, PaginatedResponse, StatCategory } from "@/lib/types"

export async function getAllPlayers(): Promise<Player[]> {
  const query = `
    SELECT p.*, t.teamName, t.teamLocation, t.shortName, t.slug as teamSlug
    FROM players p
    LEFT JOIN team t ON p.team_id = t.id
    ORDER BY p.name
  `

  const players = await executeQuery<any[]>(query)

  return players.map((player) => ({
    id: player.id,
    name: player.name,
    team_id: player.team_id,
    team: player.team_id
      ? {
          id: player.team_id,
          teamName: player.teamName,
          teamLocation: player.teamLocation,
          shortName: player.shortName,
          slug: player.teamSlug,
        }
      : undefined,
  }))
}

export async function getPlayerById(id: number): Promise<Player | null> {
  const query = `
    SELECT p.*, t.teamName, t.teamLocation, t.shortName, t.slug as teamSlug
    FROM players p
    LEFT JOIN team t ON p.team_id = t.id
    WHERE p.id = ?
  `

  const players = await executeQuery<any[]>(query, [id])

  if (players.length === 0) {
    return null
  }

  const player = players[0]

  return {
    id: player.id,
    name: player.name,
    team_id: player.team_id,
    team: player.team_id
      ? {
          id: player.team_id,
          teamName: player.teamName,
          teamLocation: player.teamLocation,
          shortName: player.shortName,
          slug: player.teamSlug,
        }
      : undefined,
  }
}

export async function getPlayerBySlug(slug: string): Promise<Player | null> {
  // Convert slug to player name (e.g., "john-doe" to "John Doe")
  const possibleName = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

  const query = `
    SELECT p.*, t.teamName, t.teamLocation, t.shortName, t.slug as teamSlug
    FROM players p
    LEFT JOIN team t ON p.team_id = t.id
    WHERE p.name = ?
  `

  const players = await executeQuery<any[]>(query, [possibleName])

  if (players.length === 0) {
    return null
  }

  const player = players[0]

  return {
    id: player.id,
    name: player.name,
    team_id: player.team_id,
    team: player.team_id
      ? {
          id: player.team_id,
          teamName: player.teamName,
          teamLocation: player.teamLocation,
          shortName: player.shortName,
          slug: player.teamSlug,
        }
      : undefined,
  }
}

export async function getPlayerStats(playerId: number, seasonId = 1): Promise<PlayerSeasonStats | null> {
  const query = `
    SELECT * FROM vw_player_season_stats
    WHERE player_id = ? AND season_id = ?
  `

  const stats = await executeQuery<PlayerSeasonStats[]>(query, [playerId, seasonId])

  if (stats.length === 0) {
    return null
  }

  return stats[0]
}

export async function getTopPlayersByCategory(
  category: StatCategory,
  seasonId = 1,
  limit = 10,
  page = 1,
  search = "",
): Promise<PaginatedResponse<Player & { statValue: number }>> {
  let orderByColumn: string
  let joinClause = ""

  // Determine which column to sort by based on category
  switch (category) {
    case "hardpoint":
      orderByColumn = "hp.kd DESC"
      joinClause = 'JOIN bp_mode_stats hp ON ps.id = hp.bp_seasonal_id AND hp.mode = "HP"'
      break
    case "search":
      orderByColumn = "snd.kd DESC"
      joinClause = 'JOIN bp_mode_stats snd ON ps.id = snd.bp_seasonal_id AND snd.mode = "SND"'
      break
    case "control":
      orderByColumn = "ctl.kd DESC"
      joinClause = 'JOIN bp_mode_stats ctl ON ps.id = ctl.bp_seasonal_id AND ctl.mode = "CTL"'
      break
    case "overall":
    default:
      orderByColumn = "ps.kd DESC"
      break
  }

  // Calculate offset for pagination
  const offset = (page - 1) * limit

  // Add search condition if search is provided
  const searchCondition = search ? `AND p.name LIKE ?` : ""
  const searchParam = search ? `%${search}%` : ""

  // Get total count for pagination
  const countQuery = `
    SELECT COUNT(*) as total
    FROM player_season_stats ps
    JOIN players p ON ps.player_id = p.id
    LEFT JOIN team t ON p.team_id = t.id
    ${joinClause}
    WHERE ps.season_id = ? ${searchCondition}
  `

  const countParams = search ? [seasonId, searchParam] : [seasonId]
  const countResult = await executeQuery<any[]>(countQuery, countParams)
  const total = countResult[0].total

  // Get paginated results
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.team_id, 
      t.teamName, 
      t.teamLocation, 
      t.shortName, 
      t.slug as teamSlug,
      ps.kd as overall_kd,
      ${
        category === "hardpoint"
          ? "hp.kd"
          : category === "search"
            ? "snd.kd"
            : category === "control"
              ? "ctl.kd"
              : "ps.kd"
      } as statValue
    FROM player_season_stats ps
    JOIN players p ON ps.player_id = p.id
    LEFT JOIN team t ON p.team_id = t.id
    LEFT JOIN bp_mode_stats hp ON ps.id = hp.bp_seasonal_id AND hp.mode = "HP"
    LEFT JOIN bp_mode_stats snd ON ps.id = snd.bp_seasonal_id AND snd.mode = "SND"
    LEFT JOIN bp_mode_stats ctl ON ps.id = ctl.bp_seasonal_id AND ctl.mode = "CTL"
    WHERE ps.season_id = ? ${searchCondition}
    ORDER BY ${orderByColumn}
    LIMIT ? OFFSET ?
  `

  const queryParams = search ? [seasonId, searchParam, limit, offset] : [seasonId, limit, offset]

  const players = await executeQuery<any[]>(query, queryParams)

  const totalPages = Math.ceil(total / limit)

  return {
    success: true,
    data: players.map((player) => ({
      id: player.id,
      name: player.name,
      team_id: player.team_id,
      statValue: player.statValue,
      team: player.team_id
        ? {
            id: player.team_id,
            teamName: player.teamName,
            teamLocation: player.teamLocation,
            shortName: player.shortName,
            slug: player.teamSlug,
          }
        : undefined,
    })),
    total,
    page,
    limit,
    totalPages,
  }
}

// New function to get detailed player stats for comparison
export async function getDetailedPlayerStats(playerId: number, seasonId = 1): Promise<any | null> {
  const query = `
    SELECT 
      ps.*,
      hp.kd as hp_kd,
      hp.kills_per_10_min as hp_kills_per_10min,
      hp.damage_per_10_min as hp_damage_per_10min,
      hp.obj_per_10_min as hp_obj_per_10min,
      hp.maps_played as hp_maps_played,
      snd.kd as snd_kd,
      snd.kills_per_round as snd_kills_per_round,
      snd.first_bloods,
      snd.first_deaths,
      snd.maps_played as snd_maps_played,
      ctl.kd as ctl_kd,
      ctl.kills_per_10_min as ctl_kills_per_10min,
      ctl.damage_per_10_min as ctl_damage_per_10min,
      ctl.zone_tier_captures,
      ctl.maps_played as ctl_maps_played
    FROM player_season_stats ps
    LEFT JOIN bp_mode_stats hp ON ps.id = hp.bp_seasonal_id AND hp.mode = "HP"
    LEFT JOIN bp_mode_stats snd ON ps.id = snd.bp_seasonal_id AND snd.mode = "SND"
    LEFT JOIN bp_mode_stats ctl ON ps.id = ctl.bp_seasonal_id AND ctl.mode = "CTL"
    WHERE ps.player_id = ? AND ps.season_id = ?
  `

  const stats = await executeQuery<any[]>(query, [playerId, seasonId])

  if (stats.length === 0) {
    return null
  }

  return stats[0]
}

// New function to search players by name
export async function searchPlayers(query: string, limit = 10): Promise<Player[]> {
  const searchQuery = `
    SELECT p.*, t.teamName, t.teamLocation, t.shortName, t.slug as teamSlug
    FROM players p
    LEFT JOIN team t ON p.team_id = t.id
    WHERE p.name LIKE ?
    ORDER BY p.name
    LIMIT ?
  `

  const players = await executeQuery<any[]>(searchQuery, [`%${query}%`, limit])

  return players.map((player) => ({
    id: player.id,
    name: player.name,
    team_id: player.team_id,
    team: player.team_id
      ? {
          id: player.team_id,
          teamName: player.teamName,
          teamLocation: player.teamLocation,
          shortName: player.shortName,
          slug: player.teamSlug,
        }
      : undefined,
  }))
}
