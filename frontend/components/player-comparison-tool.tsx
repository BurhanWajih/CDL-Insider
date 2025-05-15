"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, X, BarChart, PieChart } from "lucide-react"
import Image from "next/image"
import SearchBar from "@/components/search-bar"
import { getPlayerImageUrl, handleImageError } from "@/lib/image-utils"
import type { Player } from "@/lib/types"

export default function PlayerComparisonTool() {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [searchResults, setSearchResults] = useState<Player[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [playerStats, setPlayerStats] = useState<Record<number, any>>({})

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch(`/api/players/search?q=${encodeURIComponent(query)}&limit=5`)

      if (!response.ok) {
        throw new Error("Failed to search players")
      }

      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error("Error searching players:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Add player to comparison
  const addPlayer = async (player: Player) => {
    if (selectedPlayers.length >= 3) {
      return // Limit to 3 players
    }

    if (selectedPlayers.some((p) => p.id === player.id)) {
      return // Player already added
    }

    setSelectedPlayers([...selectedPlayers, player])

    // Clear search
    setSearchQuery("")
    setSearchResults([])

    // Fetch player stats
    fetchPlayerStats(player.id)
  }

  // Remove player from comparison
  const removePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId))

    // Remove player stats
    const newPlayerStats = { ...playerStats }
    delete newPlayerStats[playerId]
    setPlayerStats(newPlayerStats)
  }

  // Fetch player stats
  const fetchPlayerStats = async (playerId: number) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/players/${playerId}?detailed=true`)

      if (!response.ok) {
        throw new Error("Failed to fetch player stats")
      }

      const data = await response.json()

      if (data.success) {
        setPlayerStats((prev) => ({
          ...prev,
          [playerId]: data.data.seasonStats,
        }))
      }
    } catch (error) {
      console.error("Error fetching player stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-zinc-900">
      <CardHeader>
        <CardTitle>Player Comparison Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="mb-2 text-sm text-zinc-400">Select up to 3 players to compare their statistics</div>

          <div className="mb-4">
            <SearchBar placeholder="Search for players to compare..." onSearch={handleSearch} value={searchQuery} />
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="mb-4 rounded-md bg-zinc-800 p-2">
              <Skeleton className="h-10 w-full" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="mb-4 rounded-md bg-zinc-800 p-2">
              <ul className="divide-y divide-zinc-700">
                {searchResults.map((player) => (
                  <li key={player.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="mr-3 h-8 w-8 overflow-hidden rounded-full bg-zinc-700">
                        <Image
                          src={getPlayerImageUrl(player.name) || "/placeholder.svg?height=32&width=32"}
                          alt={player.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                          onError={(e) => handleImageError(e, 32, 32)}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-zinc-400">{player.team ? player.team.teamName : "Free Agent"}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addPlayer(player)}
                      disabled={selectedPlayers.some((p) => p.id === player.id) || selectedPlayers.length >= 3}
                    >
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            searchQuery.length > 0 && (
              <div className="mb-4 rounded-md bg-zinc-800 p-4 text-center text-zinc-400">
                No players found matching "{searchQuery}"
              </div>
            )
          )}

          {/* Selected Players */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {selectedPlayers.map((player) => (
              <div key={player.id} className="relative rounded-md bg-zinc-800 p-4">
                <button
                  className="absolute right-2 top-2 rounded-full bg-zinc-700 p-1 text-zinc-400 hover:bg-zinc-600 hover:text-white"
                  onClick={() => removePlayer(player.id)}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center">
                  <div className="mr-3 h-12 w-12 overflow-hidden rounded-full bg-zinc-700">
                    <Image
                      src={getPlayerImageUrl(player.name) || "/placeholder.svg?height=48&width=48"}
                      alt={player.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      onError={(e) => handleImageError(e, 48, 48)}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-zinc-400">{player.team ? player.team.teamName : "Free Agent"}</div>
                  </div>
                </div>
                {isLoading && !playerStats[player.id] ? (
                  <div className="mt-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-3/4" />
                  </div>
                ) : playerStats[player.id] ? (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-md bg-zinc-700 p-2">
                      <div className="text-xs text-zinc-400">K/D</div>
                      <div className="font-bold">{playerStats[player.id].kd?.toFixed(2) || "N/A"}</div>
                    </div>
                    <div className="rounded-md bg-zinc-700 p-2">
                      <div className="text-xs text-zinc-400">Rating</div>
                      <div className="font-bold">{playerStats[player.id].overall_rating?.toFixed(2) || "N/A"}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 3 - selectedPlayers.length) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex h-[120px] items-center justify-center rounded-md border border-dashed border-zinc-700 bg-zinc-800/50 p-4"
              >
                <div className="text-center text-zinc-500">
                  <PlusCircle className="mx-auto mb-1 h-6 w-6" />
                  <div className="text-sm">Add Player</div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Content */}
          {selectedPlayers.length > 0 ? (
            <div>
              <Tabs defaultValue="overview" onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start bg-zinc-800">
                  <TabsTrigger value="overview" className="flex items-center">
                    <BarChart className="mr-1 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="modes" className="flex items-center">
                    <PieChart className="mr-1 h-4 w-4" />
                    Game Modes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stat</TableHead>
                        {selectedPlayers.map((player) => (
                          <TableHead key={player.id}>{player.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">K/D Ratio</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={player.id} className="font-bold">
                            {playerStats[player.id]?.kd?.toFixed(2) || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Overall Rating</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={player.id} className="font-bold">
                            {playerStats[player.id]?.overall_rating?.toFixed(2) || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Slayer Rating</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={player.id} className="font-bold">
                            {playerStats[player.id]?.slayer_rating?.toFixed(2) || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Engagement Success</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={player.id} className="font-bold">
                            {playerStats[player.id]?.true_engagement_success
                              ? `${(playerStats[player.id].true_engagement_success * 100).toFixed(1)}%`
                              : "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Non-Traded Kills</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={player.id} className="font-bold">
                            {playerStats[player.id]?.non_traded_kills || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Game Time (min)</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={player.id} className="font-bold">
                            {playerStats[player.id]?.game_time_minutes || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="modes" className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-lg font-medium">Hardpoint</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Stat</TableHead>
                            {selectedPlayers.map((player) => (
                              <TableHead key={player.id}>{player.name}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">K/D Ratio</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.hp_kd?.toFixed(2) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Kills Per 10 Min</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.hp_kills_per_10min?.toFixed(2) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Damage Per 10 Min</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.hp_damage_per_10min?.toFixed(0) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Obj Per 10 Min</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.hp_obj_per_10min?.toFixed(2) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Search & Destroy</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Stat</TableHead>
                            {selectedPlayers.map((player) => (
                              <TableHead key={player.id}>{player.name}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">K/D Ratio</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.snd_kd?.toFixed(2) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Kills Per Round</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.snd_kills_per_round?.toFixed(2) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">First Bloods</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.first_bloods || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">First Deaths</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.first_deaths || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Control</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Stat</TableHead>
                            {selectedPlayers.map((player) => (
                              <TableHead key={player.id}>{player.name}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">K/D Ratio</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.ctl_kd?.toFixed(2) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Kills Per 10 Min</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.ctl_kills_per_10min?.toFixed(2) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Damage Per 10 Min</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.ctl_damage_per_10min?.toFixed(0) || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Zone Captures</TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell key={player.id} className="font-bold">
                                {playerStats[player.id]?.zone_tier_captures || "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-8 text-center">
              <div className="mb-4 text-4xl text-zinc-500">👥</div>
              <h3 className="mb-2 text-lg font-medium">No Players Selected</h3>
              <p className="text-zinc-400">
                Search for players above and add them to compare their statistics side by side.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
