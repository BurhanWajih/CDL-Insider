import { executeQuery } from "@/lib/db"
import type { Team, Player, PaginatedResponse } from "@/lib/types"

export async function getAllTeams(): Promise<Team[]> {
  const query = `
    SELECT * FROM team
    WHERE slug != 'free-agent'
    ORDER BY teamName
  `

  return await executeQuery<Team[]>(query)
}

export async function getTeamById(id: number): Promise<Team | null> {
  const query = `
    SELECT * FROM team
    WHERE id = ?
  `

  const teams = await executeQuery<Team[]>(query, [id])

  if (teams.length === 0) {
    return null
  }

  return teams[0]
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const query = `
    SELECT * FROM team
    WHERE slug = ?
  `

  const teams = await executeQuery<Team[]>(query, [slug])

  if (teams.length === 0) {
    return null
  }

  return teams[0]
}

export async function getTeamPlayers(teamId: number): Promise<Player[]> {
  const query = `
    SELECT p.*, 
           ps.kd, ps.Player_Rank
    FROM players p
    LEFT JOIN player_season_stats ps ON p.id = ps.player_id AND ps.season_id = 1
    WHERE p.team_id = ?
    ORDER BY ps.Player_Rank
  `

  const players = await executeQuery<any[]>(query, [teamId])

  return players.map((player) => ({
    id: player.id,
    name: player.name,
    team_id: player.team_id,
    currentSeasonStats: player.kd
      ? {
          kd: player.kd,
          Player_Rank: player.Player_Rank,
        }
      : undefined,
  }))
}

export async function getTeamStandings(seasonId = 1): Promise<PaginatedResponse<Team & { stats: any }>> {
  // This is a mock implementation since the database doesn't have team standings
  // In a real implementation, you would query team match results and calculate standings

  const query = `
    SELECT t.*, 
           AVG(ps.kd) as avg_kd,
           AVG(ps.overall_rating) as avg_rating
    FROM team t
    JOIN players p ON t.id = p.team_id
    JOIN player_season_stats ps ON p.id = ps.player_id
    WHERE ps.season_id = ? AND t.slug != 'free-agent'
    GROUP BY t.id
    ORDER BY avg_rating DESC
  `

  const teams = await executeQuery<any[]>(query, [seasonId])

  // Mock win/loss data since it's not in the database
  const teamsWithStats = teams.map((team, index) => {
    // Generate mock win/loss data based on team ranking
    const wins = Math.round(30 - index * 1.5)
    const losses = Math.round(5 + index * 1.5)
    const winPercentage = wins / (wins + losses)

    return {
      ...team,
      stats: {
        wins,
        losses,
        winPercentage,
        avg_kd: Number.parseFloat(team.avg_kd.toFixed(2)),
        avg_rating: Number.parseFloat(team.avg_rating.toFixed(2)),
      },
    }
  })

  return {
    success: true,
    data: teamsWithStats,
    total: teamsWithStats.length,
    page: 1,
    limit: teamsWithStats.length,
    totalPages: 1,
  }
}

export async function getTeamDetailedStats(teamId: number): Promise<any> {
  // This is a mock implementation since we don't have actual team stats in the database
  // In a real implementation, you would query the database for team stats

  // Get the team's players
  const players = await getTeamPlayers(teamId)

  // Calculate average stats
  let totalKD = 0
  let totalRating = 0
  let playerCount = 0

  players.forEach((player) => {
    if (player.currentSeasonStats) {
      totalKD += player.currentSeasonStats.kd || 0
      totalRating += player.currentSeasonStats.overall_rating || 0
      playerCount++
    }
  })

  const avgKD = playerCount > 0 ? totalKD / playerCount : 0
  const avgRating = playerCount > 0 ? totalRating / playerCount : 0

  // Generate mock win/loss data
  const wins = Math.floor(Math.random() * 20) + 10
  const losses = Math.floor(Math.random() * 10) + 5
  const winPercentage = wins / (wins + losses)

  return {
    wins,
    losses,
    winPercentage,
    avg_kd: Number.parseFloat(avgKD.toFixed(2)),
    avg_rating: Number.parseFloat(avgRating.toFixed(2)),
    // Add more detailed stats here
    game_modes: {
      hardpoint: {
        win_rate: 0.68,
        avg_time: 187,
        avg_kills: 124,
      },
      search_and_destroy: {
        win_rate: 0.72,
        avg_rounds: 8.3,
        first_bloods: 42,
      },
      control: {
        win_rate: 0.65,
        avg_lives: 28.4,
        captures: 18,
      },
    },
  }
}
