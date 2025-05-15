"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import type { Player, StatCategory } from "@/lib/types"

export default function TopPlayersSection() {
  const [activeTab, setActiveTab] = useState<StatCategory>("overall")
  const [players, setPlayers] = useState<(Player & { statValue: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/players/top/${activeTab}?limit=5`)

        if (!response.ok) {
          throw new Error(`Failed to fetch top players: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch top players")
        }

        setPlayers(data.data.data)
      } catch (err) {
        console.error("Error fetching top players:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopPlayers()
  }, [activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value as StatCategory)
  }

  return (
    <Card className="bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-2xl">Top Players</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" onValueChange={handleTabChange}>
          <TabsList className="mb-6 grid w-full grid-cols-4 bg-zinc-800">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="hardpoint">Hardpoint</TabsTrigger>
            <TabsTrigger value="search">Search & Destroy</TabsTrigger>
            <TabsTrigger value="control">Control</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            {isLoading ? (
              <TopPlayersSkeleton />
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <TopPlayersList players={players} statLabel="K/D" />
            )}
          </TabsContent>

          <TabsContent value="hardpoint" className="space-y-4">
            {isLoading ? (
              <TopPlayersSkeleton />
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <TopPlayersList players={players} statLabel="HP K/D" />
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            {isLoading ? (
              <TopPlayersSkeleton />
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <TopPlayersList players={players} statLabel="S&D K/D" />
            )}
          </TabsContent>

          <TabsContent value="control" className="space-y-4">
            {isLoading ? (
              <TopPlayersSkeleton />
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <TopPlayersList players={players} statLabel="CTL K/D" />
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center">
          <Link href="/player-stats" className="text-sm font-medium text-orange-500 hover:text-orange-400">
            View All Player Stats →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function TopPlayersList({
  players,
  statLabel,
}: {
  players: (Player & { statValue: number })[]
  statLabel: string
}) {
  // If no players, show a message
  if (!players || players.length === 0) {
    return (
      <div className="rounded-md bg-zinc-800 p-4 text-center">
        <p>No player data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {players.map((player, index) => (
        <Link
          key={player.id || index}
          href={`/players/${player.name?.toLowerCase().replace(/\s+/g, "-") || "#"}`}
          className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-zinc-800"
        >
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex items-center">
              <div className="mr-3 h-8 w-8 overflow-hidden rounded-full bg-zinc-700">
                <Image
                  src={`/placeholder.svg?height=32&width=32`}
                  alt={player.name || "Player"}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{player.name || "Unknown Player"}</div>
                <div className="text-xs text-zinc-400">{player.team?.teamName || "Free Agent"}</div>
              </div>
            </div>
          </div>
          <div className="text-lg font-bold">{player.statValue?.toFixed(2) || "0.00"}</div>
        </Link>
      ))}
    </div>
  )
}

function TopPlayersSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center justify-between rounded-md p-3">
          <div className="flex items-center">
            <Skeleton className="mr-3 h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="mb-1 h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  )
}
