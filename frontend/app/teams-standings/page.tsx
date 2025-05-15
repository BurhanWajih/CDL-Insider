"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import SearchBar from "@/components/search-bar"
import { getTeamImageUrl, handleImageError } from "@/lib/image-utils"
import { motion } from "framer-motion"
import type { Team } from "@/lib/types"

export default function TeamsStandingsPage() {
  const [teams, setTeams] = useState<(Team & { stats: any })[]>([])
  const [filteredTeams, setFilteredTeams] = useState<(Team & { stats: any })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/teams/standings")

        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch teams")
        }

        setTeams(data.data.data)
        setFilteredTeams(data.data.data)
      } catch (err) {
        console.error("Error fetching teams:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredTeams(teams)
      return
    }

    const filtered = teams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(query.toLowerCase()) ||
        team.teamLocation.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredTeams(filtered)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6">
        <h1 className="mb-8 text-center text-4xl font-bold">Teams Standings</h1>
        <TeamStandingsSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6">
        <h1 className="mb-8 text-center text-4xl font-bold">Teams Standings</h1>
        <motion.div
          className="rounded-lg border border-red-800 bg-red-950 p-6 text-center text-red-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p>Error loading team standings: {error}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <motion.h1
        className="mb-8 text-center text-4xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Teams Standings
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mb-8 bg-zinc-900">
          <CardHeader>
            <CardTitle>Search Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchBar placeholder="Search by team name or location..." onSearch={handleSearch} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle>2025 Season Standings</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTeams.length === 0 ? (
              <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-6 text-center">
                <p>No teams found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">Win %</TableHead>
                      <TableHead className="text-center">Avg K/D</TableHead>
                      <TableHead className="text-center">Avg Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team, index) => (
                      <motion.tr
                        key={team.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                        className="hover:bg-zinc-800/50"
                      >
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Link href={`/teams/${team.slug}`} className="flex items-center">
                            <div className="mr-3 h-8 w-8 overflow-hidden">
                              <Image
                                src={getTeamImageUrl(team.slug) || "/placeholder.svg"}
                                alt={team.teamName}
                                width={32}
                                height={32}
                                className="h-full w-full object-contain"
                                onError={(e) => handleImageError(e, 32, 32)}
                              />
                            </div>
                            <div>
                              <span className="font-medium">{team.teamName}</span>
                              <div className="text-xs text-zinc-400">{team.teamLocation}</div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">{team.stats.wins}</TableCell>
                        <TableCell className="text-center">{team.stats.losses}</TableCell>
                        <TableCell className="text-center">{(team.stats.winPercentage * 100).toFixed(1)}%</TableCell>
                        <TableCell className="text-center">{team.stats.avg_kd}</TableCell>
                        <TableCell className="text-center">{team.stats.avg_rating}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function TeamStandingsSkeleton() {
  return (
    <Card className="bg-zinc-900">
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">Win %</TableHead>
                <TableHead className="text-center">Avg K/D</TableHead>
                <TableHead className="text-center">Avg Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(12)].map((_, index) => (
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
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-8" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-8" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-12" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
