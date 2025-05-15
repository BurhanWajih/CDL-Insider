// Player types
export interface Player {
  id: number
  name: string
  team_id: number
  team?: Team
  seasonStats?: PlayerSeasonStats[]
  currentSeasonStats?: PlayerSeasonStats
}

// Team types
export interface Team {
  id: number
  slug: string
  teamLocation: string
  teamName: string
  shortName: string
  players?: Player[]
}

// Season types
export interface Season {
  id: number
  year: number
  title: string
}

// Player season stats types
export interface PlayerSeasonStats {
  bp_seasonal_id: number
  player_id: number
  season_id: number
  Player_Rank: number
  kd: number
  overall_rating: number
  slayer_rating: number
  true_engagement_success: number
  game_time_minutes: number
  non_traded_kills: number

  // Hardpoint stats
  hp_kd: number | null
  hp_kills_per_10min: number | null
  hp_damage_per_10min: number | null
  hp_obj_per_10min: number | null
  hp_engagements_per_10min: number | null
  hp_maps_played: number | null

  // Search & Destroy stats
  snd_kd: number | null
  snd_kills_per_round: number | null
  first_bloods: number | null
  first_deaths: number | null
  opd_win_percentage: number | null
  plants: number | null
  defuses: number | null
  snd_maps: number | null

  // Control stats
  ctl_kd: number | null
  ctl_kills_per_10min: number | null
  ctl_damage_per_10min: number | null
  ctl_engagements_per_10min: number | null
  zone_tier_captures: number | null
  ctl_maps: number | null
}

// Game mode types
export type GameMode = "HP" | "SND" | "CTL"

// Mode-specific stats
export interface ModeStats {
  id: number
  bp_seasonal_id: number
  mode: GameMode
  kd: number | null
  kills_per_10_min: number | null
  damage_per_10_min: number | null
  engagements_per_10_min: number | null
  maps_played: number | null
  obj_per_10_min: number | null
  zone_tier_captures: number | null
  kills_per_round: number | null
  first_bloods: number | null
  first_deaths: number | null
  opd_win_percentage: number | null
  plants: number | null
  defuses: number | null
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  error?: string
}

// Stat category for filtering
export type StatCategory = "overall" | "hardpoint" | "search" | "control"
