"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { Trophy, Medal, Target, Bomb, Clock } from "lucide-react"
import { getTeamImageUrl, getPlayerImageUrl, handleImageError } from "@/lib/image-utils"
import { motion } from "framer-motion"
import type { Team, Player } from "@/lib/types"

interface TeamPageProps {
  params: {
    slug: string
  }
}

export default function TeamPage({ params }: TeamPageProps) {
  const [team, setTeam] = useState<Team & { players?: Player[]; stats?: any }>()
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

    const fetchTeam = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/teams/slug/${slug}?detailed=true`)

        if (!response.ok) {
          throw new Error(`Failed to fetch team: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch team")
        }

        setTeam(data.data)
      } catch (err) {
        console.error("Error fetching team:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeam()
  }, [slug])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6">
        <TeamPageSkeleton />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6">
        <motion.div
          className="rounded-lg border border-red-800 bg-red-950 p-6 text-center text-red-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-2 text-xl font-bold">Error Loading Team</h2>
          <p>{error || "Team not found"}</p>
          <Link href="/teams-standings" className="mt-4 inline-block text-white underline">
            Return to Team Standings
          </Link>
        </motion.div>
      </div>
    )
  }

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
              className="mb-4 h-32 w-32 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Image
                src={getTeamImageUrl(team.slug) || "/placeholder.svg"}
                alt={team.teamName}
                width={128}
                height={128}
                className="h-full w-full object-contain"
                onError={(e) => handleImageError(e, 128, 128)}
              />
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="mb-2 text-4xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {team.teamName}
            </motion.h1>
            <motion.p
              className="text-xl text-zinc-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {team.teamLocation}
            </motion.p>

            {team.stats && (
              <motion.div
                className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="rounded-md bg-zinc-800 p-3 text-center">
                  <div className="text-sm text-zinc-400">Record</div>
                  <div className="text-xl font-bold">
                    {team.stats.wins}-{team.stats.losses}
                  </div>
                </div>
                <div className="rounded-md bg-zinc-800 p-3 text-center">
                  <div className="text-sm text-zinc-400">Win %</div>
                  <div className="text-xl font-bold">{(team.stats.winPercentage * 100).toFixed(1)}%</div>
                </div>
                <div className="rounded-md bg-zinc-800 p-3 text-center">
                  <div className="text-sm text-zinc-400">Avg K/D</div>
                  <div className="text-xl font-bold">{team.stats.avg_kd}</div>
                </div>
                <div className="rounded-md bg-zinc-800 p-3 text-center">
                  <div className="text-sm text-zinc-400">Avg Rating</div>
                  <div className="text-xl font-bold">{team.stats.avg_rating}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Tabs defaultValue="roster" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 bg-zinc-900">
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="stats">Team Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="roster">
            <Card className="bg-zinc-900">
              <CardHeader>
                <CardTitle>Team Roster</CardTitle>
              </CardHeader>
              <CardContent>
                {team.players && team.players.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">K/D</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
                        <TableHead className="text-right">Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.players.map((player, index) => (
                        <motion.tr
                          key={player.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                          className="hover:bg-zinc-800/50"
                        >
                          <TableCell>
                            <Link
                              href={`/players/${player.name.toLowerCase().replace(/\s+/g, "-")}`}
                              className="flex items-center"
                            >
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
                            </Link>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {player.currentSeasonStats?.kd.toFixed(2) || "N/A"}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {player.currentSeasonStats?.overall_rating?.toFixed(2) || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {player.currentSeasonStats?.Player_Rank
                              ? `#${player.currentSeasonStats.Player_Rank}`
                              : "N/A"}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center">
                    <p>No players found for this team.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="bg-zinc-900">
                  <CardHeader>
                    <CardTitle>Game Mode Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <Target className="mr-2 h-4 w-4 text-orange-500" />
                          <span className="font-medium">Hardpoint</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Win Rate</span>
                            <span className="font-bold">68%</span>
                          </div>
                          <Progress value={68} className="h-2 bg-zinc-800">
                            <div className="h-full bg-orange-500" />
                          </Progress>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center">
                          <Bomb className="mr-2 h-4 w-4 text-orange-500" />
                          <span className="font-medium">Search & Destroy</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Win Rate</span>
                            <span className="font-bold">72%</span>
                          </div>
                          <Progress value={72} className="h-2 bg-zinc-800">
                            <div className="h-full bg-orange-500" />
                          </Progress>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-orange-500" />
                          <span className="font-medium">Control</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Win Rate</span>
                            <span className="font-bold">65%</span>
                          </div>
                          <Progress value={65} className="h-2 bg-zinc-800">
                            <div className="h-full bg-orange-500" />
                          </Progress>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="bg-zinc-900">
                  <CardHeader>
                    <CardTitle>Team Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Major III Champions</h3>
                          <p className="text-sm text-zinc-400">April 2025</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800">
                          <Medal className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Major II Runner-up</h3>
                          <p className="text-sm text-zinc-400">March 2025</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">2024 CDL Championship</h3>
                          <p className="text-sm text-zinc-400">August 2024</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function TeamPageSkeleton() {
  return (
    <>
      <div className="mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-r from-zinc-900 to-black">
        <div className="flex flex-col p-6 md:flex-row md:items-center md:p-8">
          <div className="mb-6 flex flex-col items-center md:mb-0 md:mr-8 md:items-start">
            <Skeleton className="mb-4 h-32 w-32 rounded-full" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <Skeleton className="mb-2 h-10 w-48 md:w-64" />
            <Skeleton className="h-6 w-32" />

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Skeleton className="mb-8 h-12 w-full rounded-lg" />

      <Card className="bg-zinc-900">
        <CardHeader>
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">K/D</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="mr-3 h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
