"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Target, Bomb, Clock } from "lucide-react"
import { getPlayerImageUrl, getTeamImageUrl, handleImageError } from "@/lib/image-utils"
import { motion, AnimatePresence } from "framer-motion"
import type { Player, StatCategory } from "@/lib/types"

interface PlayerStatsTableProps {
  category: StatCategory
  limit?: number
  page?: number
  searchQuery?: string
}

export default function PlayerStatsTable({ category, limit = 20, page = 1, searchQuery = "" }: PlayerStatsTableProps) {
  const [players, setPlayers] = useState<(Player & { statValue: number })[]>([])
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [playerDetails, setPlayerDetails] = useState<Record<number, any>>({})

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Build the URL with all parameters
        let url = `/api/players/top/${category}?limit=${limit}&page=${currentPage}`

        // Add search query if provided
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch players: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch players")
        }

        setPlayers(data.data.data)
        setTotalPages(data.data.totalPages)
      } catch (err) {
        console.error("Error fetching players:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [category, limit, currentPage, searchQuery])

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const getStatLabel = () => {
    switch (category) {
      case "hardpoint":
        return "HP K/D"
      case "search":
        return "S&D K/D"
      case "control":
        return "CTL K/D"
      case "overall":
      default:
        return "K/D"
    }
  }

  const toggleRowExpansion = async (playerId: number) => {
    const newExpandedRows = new Set(expandedRows)

    if (expandedRows.has(playerId)) {
      newExpandedRows.delete(playerId)
    } else {
      newExpandedRows.add(playerId)

      // Fetch player details if not already loaded
      if (!playerDetails[playerId]) {
        try {
          const response = await fetch(`/api/players/${playerId}?detailed=true`)

          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setPlayerDetails((prev) => ({
                ...prev,
                [playerId]: data.data.seasonStats,
              }))
            }
          }
        } catch (error) {
          console.error("Error fetching player details:", error)
        }
      }
    }

    setExpandedRows(newExpandedRows)
  }

  const toggleAllRows = () => {
    if (expandedRows.size > 0) {
      setExpandedRows(new Set())
    } else {
      const allIds = players.map((player) => player.id)
      setExpandedRows(new Set(allIds))

      // Fetch details for all players
      allIds.forEach(async (id) => {
        if (!playerDetails[id]) {
          try {
            const response = await fetch(`/api/players/${id}?detailed=true`)

            if (response.ok) {
              const data = await response.json()
              if (data.success) {
                setPlayerDetails((prev) => ({
                  ...prev,
                  [id]: data.data.seasonStats,
                }))
              }
            }
          } catch (error) {
            console.error("Error fetching player details:", error)
          }
        }
      })
    }
  }

  if (isLoading) {
    return <PlayerStatsTableSkeleton />
  }

  if (error) {
    return (
      <motion.div
        className="rounded-lg border border-red-800 bg-red-950 p-4 text-center text-red-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p>Error loading player stats: {error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
          Try Again
        </Button>
      </motion.div>
    )
  }

  if (players.length === 0) {
    return (
      <motion.div
        className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p>No players found{searchQuery ? ` matching "${searchQuery}"` : ""}.</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={toggleAllRows} className="flex items-center gap-1">
          {expandedRows.size > 0 ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Collapse All
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Expand All
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">{getStatLabel()}</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <React.Fragment key={player.id}>
                <TableRow
                  className="cursor-pointer transition-colors hover:bg-zinc-800/50"
                  onClick={() => toggleRowExpansion(player.id)}
                >
                  <TableCell className="text-center font-medium">{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="mr-3 h-8 w-8 overflow-hidden rounded-full bg-zinc-700">
                        <Image
                          src={getPlayerImageUrl(player.name) || "/placeholder.svg"}
                          alt={player.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                          onError={(e) => handleImageError(e, 32, 32)}
                        />
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {player.team ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-6 w-6 overflow-hidden rounded-full bg-zinc-700">
                          <Image
                            src={getTeamImageUrl(player.team.slug) || "/placeholder.svg"}
                            alt={player.team.teamName}
                            width={24}
                            height={24}
                            className="h-full w-full object-cover"
                            onError={(e) => handleImageError(e, 24, 24)}
                          />
                        </div>
                        <span>{player.team.teamName}</span>
                      </div>
                    ) : (
                      "Free Agent"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold">{player.statValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      {expandedRows.has(player.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>

                <AnimatePresence>
                  {expandedRows.has(player.id) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell colSpan={5} className="bg-zinc-800/30 p-0">
                        <div className="p-4">
                          {playerDetails[player.id] ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div className="space-y-2 rounded-md bg-zinc-800 p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Target className="mr-2 h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium">Overall</span>
                                  </div>
                                  <Badge variant="outline" className="bg-zinc-700">
                                    Rank #{playerDetails[player.id].Player_Rank || "N/A"}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <div className="text-xs text-zinc-400">K/D Ratio</div>
                                    <div className="font-bold">{playerDetails[player.id].kd?.toFixed(2) || "N/A"}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Rating</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].overall_rating?.toFixed(2) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Slayer Rating</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].slayer_rating?.toFixed(2) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Engagement</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].true_engagement_success
                                        ? `${(playerDetails[player.id].true_engagement_success * 100).toFixed(1)}%`
                                        : "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 rounded-md bg-zinc-800 p-3">
                                <div className="flex items-center">
                                  <Target className="mr-2 h-4 w-4 text-orange-500" />
                                  <span className="text-sm font-medium">Hardpoint</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <div className="text-xs text-zinc-400">HP K/D</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].hp_kd?.toFixed(2) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Kills/10min</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].hp_kills_per_10min?.toFixed(1) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Damage/10min</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].hp_damage_per_10min?.toFixed(0) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Maps</div>
                                    <div className="font-bold">{playerDetails[player.id].hp_maps_played || "N/A"}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 rounded-md bg-zinc-800 p-3">
                                <div className="flex items-center">
                                  <Bomb className="mr-2 h-4 w-4 text-orange-500" />
                                  <span className="text-sm font-medium">Search & Destroy</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <div className="text-xs text-zinc-400">S&D K/D</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].snd_kd?.toFixed(2) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Kills/Round</div>
                                    <div className="font-bold">
                                      {playerDetails[player.id].snd_kills_per_round?.toFixed(2) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">First Bloods</div>
                                    <div className="font-bold">{playerDetails[player.id].first_bloods || "N/A"}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-zinc-400">Maps</div>
                                    <div className="font-bold">{playerDetails[player.id].snd_maps || "N/A"}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 rounded-md bg-zinc-800 p-3 md:col-span-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium">Performance Metrics</span>
                                  </div>
                                  <Link href={`/players/${player.name.toLowerCase().replace(/\s+/g, "-")}`}>
                                    <Button size="sm" variant="outline">
                                      View Full Profile
                                    </Button>
                                  </Link>
                                </div>

                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-zinc-400">K/D Ratio</span>
                                      <span className="text-xs font-medium">
                                        {playerDetails[player.id].kd?.toFixed(2) || "N/A"}
                                      </span>
                                    </div>
                                    <Progress
                                      value={Math.min((playerDetails[player.id].kd || 0) * 50, 100)}
                                      className="h-1.5 bg-zinc-700"
                                    >
                                      <div className="h-full bg-orange-500" />
                                    </Progress>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-zinc-400">Overall Rating</span>
                                      <span className="text-xs font-medium">
                                        {playerDetails[player.id].overall_rating?.toFixed(2) || "N/A"}
                                      </span>
                                    </div>
                                    <Progress
                                      value={Math.min((playerDetails[player.id].overall_rating || 0) * 80, 100)}
                                      className="h-1.5 bg-zinc-700"
                                    >
                                      <div className="h-full bg-orange-500" />
                                    </Progress>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-zinc-400">Engagement Success</span>
                                      <span className="text-xs font-medium">
                                        {playerDetails[player.id].true_engagement_success
                                          ? `${(playerDetails[player.id].true_engagement_success * 100).toFixed(1)}%`
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <Progress
                                      value={(playerDetails[player.id].true_engagement_success || 0) * 100}
                                      className="h-1.5 bg-zinc-700"
                                    >
                                      <div className="h-full bg-orange-500" />
                                    </Progress>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex h-24 items-center justify-center">
                              <Skeleton className="h-6 w-6 animate-spin rounded-full" />
                              <span className="ml-2">Loading player details...</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <motion.div
          className="mt-4 flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

function PlayerStatsTableSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">K/D</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                <Skeleton className="mx-auto h-6 w-6 rounded-full" />
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="mr-3 h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
