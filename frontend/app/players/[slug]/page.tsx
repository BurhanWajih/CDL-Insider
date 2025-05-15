"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { getPlayerImageUrl, getTeamImageUrl, handleImageError } from "@/lib/image-utils"
import { motion } from "framer-motion"
import type { Player, PlayerSeasonStats } from "@/lib/types"
import PlayerModeStats from "@/components/player-mode-stats"

interface PlayerPageProps {
  params: {
    slug: string
  }
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const [player, setPlayer] = useState<Player & { seasonStats?: PlayerSeasonStats }>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string>("")

  useEffect(() => {
    // Set the slug from params
    setSlug(params.slug)
  }, [params])

  useEffect(() => {
    // Only fetch when slug is available
    if (!slug) return

    const fetchPlayer = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/players/slug/${slug}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch player: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch player")
        }

        setPlayer(data.data)
      } catch (err) {
        console.error("Error fetching player:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayer()
  }, [slug])

  if (isLoading) {
    return <PlayerPageSkeleton />
  }

  if (error || !player) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6">
        <motion.div
          className="rounded-lg border border-red-800 bg-red-950 p-6 text-center text-red-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-2 text-xl font-bold">Error Loading Player</h2>
          <p>{error || "Player not found"}</p>
          <Link href="/player-stats" className="mt-4 inline-block text-white underline">
            Return to Player Stats
          </Link>
        </motion.div>
      </div>
    )
  }

  const stats = player.seasonStats

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <motion.div
        className="mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-r from-zinc-900 to-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col p-6 md:flex-row md:items-center md:p-8">
          <div className="mb-6 flex flex-col items-center md:mb-0 md:mr-8 md:items-start">
            <motion.div
              className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-zinc-800"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Image
                src={getPlayerImageUrl(player.name) || "/placeholder.svg"}
                alt={player.name}
                width={128}
                height={128}
                className="h-full w-full object-cover"
                onError={(e) => handleImageError(e, 128, 128)}
              />
            </motion.div>
            {player.team && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Link
                  href={`/teams/${player.team.slug}`}
                  className="flex items-center rounded-full bg-zinc-800 px-3 py-1"
                >
                  <div className="mr-2 h-5 w-5 overflow-hidden">
                    <Image
                      src={getTeamImageUrl(player.team.slug) || "/placeholder.svg"}
                      alt={player.team.teamName}
                      width={20}
                      height={20}
                      className="h-full w-full object-contain"
                      onError={(e) => handleImageError(e, 20, 20)}
                    />
                  </div>
                  <span className="text-sm">{player.team.teamName}</span>
                </Link>
              </motion.div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="mb-2 text-4xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {player.name}
            </motion.h1>

            {stats && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Badge variant="outline" className="mr-2">
                  Rank #{stats.Player_Rank}
                </Badge>
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                  K/D: {stats.kd.toFixed(2)}
                </Badge>
              </motion.div>
            )}

            <motion.div
              className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {stats && (
                <>
                  <div className="rounded-md bg-zinc-800 p-3 text-center">
                    <div className="text-sm text-zinc-400">Overall Rating</div>
                    <div className="text-xl font-bold">{stats.overall_rating.toFixed(2)}</div>
                  </div>
                  <div className="rounded-md bg-zinc-800 p-3 text-center">
                    <div className="text-sm text-zinc-400">Slayer Rating</div>
                    <div className="text-xl font-bold">{stats.slayer_rating.toFixed(2)}</div>
                  </div>
                  <div className="rounded-md bg-zinc-800 p-3 text-center">
                    <div className="text-sm text-zinc-400">Game Time</div>
                    <div className="text-xl font-bold">{stats.game_time_minutes} min</div>
                  </div>
                  <div className="rounded-md bg-zinc-800 p-3 text-center">
                    <div className="text-sm text-zinc-400">Non-Traded Kills</div>
                    <div className="text-xl font-bold">{stats.non_traded_kills}</div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 bg-zinc-900 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hardpoint">Hardpoint</TabsTrigger>
            <TabsTrigger value="search">Search & Destroy</TabsTrigger>
            <TabsTrigger value="control">Control</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="w-full">
            {stats ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-zinc-900">
                  <CardHeader>
                    <CardTitle>Overall Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">K/D Ratio</span>
                        <span className="font-bold">{stats.kd.toFixed(2)}</span>
                      </div>
                      <Progress value={Math.min(stats.kd * 50, 100)} className="h-2 bg-zinc-800">
                        <div className="h-full bg-orange-500" />
                      </Progress>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">Engagement Success</span>
                        <span className="font-bold">{(stats.true_engagement_success * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={stats.true_engagement_success * 100} className="h-2 bg-zinc-800">
                        <div className="h-full bg-orange-500" />
                      </Progress>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">Slayer Rating</span>
                        <span className="font-bold">{stats.slayer_rating.toFixed(2)}</span>
                      </div>
                      <Progress value={Math.min(stats.slayer_rating, 100)} className="h-2 bg-zinc-800">
                        <div className="h-full bg-orange-500" />
                      </Progress>
                    </div>
                  </CardContent>
                </Card>

                <PlayerModeStats
                  title="Hardpoint"
                  kd={stats.hp_kd}
                  killsPerMin={stats.hp_kills_per_10min}
                  damagePerMin={stats.hp_damage_per_10min}
                  mapsPlayed={stats.hp_maps_played}
                  extraStat={{
                    label: "Obj Per 10 Min",
                    value: stats.hp_obj_per_10min,
                  }}
                />

                <PlayerModeStats
                  title="Search & Destroy"
                  kd={stats.snd_kd}
                  killsPerMin={stats.snd_kills_per_round}
                  mapsPlayed={stats.snd_maps}
                  extraStat={{
                    label: "First Bloods",
                    value: stats.first_bloods,
                  }}
                  extraStat2={{
                    label: "Plants/Defuses",
                    value: `${stats.plants || 0}/${stats.defuses || 0}`,
                  }}
                />

                <PlayerModeStats
                  title="Control"
                  kd={stats.ctl_kd}
                  killsPerMin={stats.ctl_kills_per_10min}
                  damagePerMin={stats.ctl_damage_per_10min}
                  mapsPlayed={stats.ctl_maps}
                  extraStat={{
                    label: "Zone Captures",
                    value: stats.zone_tier_captures,
                  }}
                />
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
                <p>No statistics available for this player.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hardpoint" className="w-full">
            {stats && stats.hp_kd ? (
              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Hardpoint Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">K/D Ratio</div>
                      <div className="text-2xl font-bold">{stats.hp_kd.toFixed(2)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Kills Per 10 Min</div>
                      <div className="text-2xl font-bold">{stats.hp_kills_per_10min.toFixed(2)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Damage Per 10 Min</div>
                      <div className="text-2xl font-bold">{stats.hp_damage_per_10min.toFixed(0)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Obj Per 10 Min</div>
                      <div className="text-2xl font-bold">{stats.hp_obj_per_10min?.toFixed(2) || "N/A"}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Engagements Per 10 Min</div>
                      <div className="text-2xl font-bold">{stats.hp_engagements_per_10min?.toFixed(2) || "N/A"}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Maps Played</div>
                      <div className="text-2xl font-bold">{stats.hp_maps_played}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
                <p>No Hardpoint statistics available for this player.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="w-full">
            {stats && stats.snd_kd ? (
              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Search & Destroy Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">K/D Ratio</div>
                      <div className="text-2xl font-bold">{stats.snd_kd.toFixed(2)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Kills Per Round</div>
                      <div className="text-2xl font-bold">{stats.snd_kills_per_round.toFixed(2)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">First Bloods</div>
                      <div className="text-2xl font-bold">{stats.first_bloods || 0}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">First Deaths</div>
                      <div className="text-2xl font-bold">{stats.first_deaths || 0}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Opening Duel Win %</div>
                      <div className="text-2xl font-bold">
                        {stats.opd_win_percentage ? (stats.opd_win_percentage * 100).toFixed(0) + "%" : "N/A"}
                      </div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Plants</div>
                      <div className="text-2xl font-bold">{stats.plants || 0}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Defuses</div>
                      <div className="text-2xl font-bold">{stats.defuses || 0}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Maps Played</div>
                      <div className="text-2xl font-bold">{stats.snd_maps}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
                <p>No Search & Destroy statistics available for this player.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="control" className="w-full">
            {stats && stats.ctl_kd ? (
              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Control Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">K/D Ratio</div>
                      <div className="text-2xl font-bold">{stats.ctl_kd.toFixed(2)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Kills Per 10 Min</div>
                      <div className="text-2xl font-bold">{stats.ctl_kills_per_10min.toFixed(2)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Damage Per 10 Min</div>
                      <div className="text-2xl font-bold">{stats.ctl_damage_per_10min.toFixed(0)}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Engagements Per 10 Min</div>
                      <div className="text-2xl font-bold">{stats.ctl_engagements_per_10min?.toFixed(2) || "N/A"}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Zone Tier Captures</div>
                      <div className="text-2xl font-bold">{stats.zone_tier_captures || 0}</div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-4 text-center">
                      <div className="text-sm text-zinc-400">Maps Played</div>
                      <div className="text-2xl font-bold">{stats.ctl_maps}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
                <p>No Control statistics available for this player.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function PlayerPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-r from-zinc-900 to-black">
        <div className="flex flex-col p-6 md:flex-row md:items-center md:p-8">
          <div className="mb-6 flex flex-col items-center md:mb-0 md:mr-8 md:items-start">
            <Skeleton className="mb-4 h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <Skeleton className="mb-2 h-10 w-48 md:w-64" />
            <Skeleton className="mb-4 h-6 w-32" />

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Skeleton className="mb-8 h-12 w-full rounded-lg" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
