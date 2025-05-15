"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TopPlayerCard from "@/components/top-player-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Player, StatCategory } from "@/lib/types"

export default function TopPlayersPage() {
  const [activeTab, setActiveTab] = useState<StatCategory>("overall")
  const [players, setPlayers] = useState<(Player & { statValue: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/players/top/${activeTab}?limit=6`)

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
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-center text-4xl font-bold">Top Players</h1>

      <Tabs defaultValue="overall" onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-4 bg-zinc-900">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="hardpoint">Hardpoint</TabsTrigger>
          <TabsTrigger value="search">Search & Destroy</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="w-full">
          {isLoading ? (
            <TopPlayersSkeleton />
          ) : error ? (
            <div className="rounded-lg border border-red-800 bg-red-950 p-6 text-center text-red-400">
              <p>Error loading players: {error}</p>
            </div>
          ) : players.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p>No players found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <TopPlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hardpoint" className="w-full">
          {isLoading ? (
            <TopPlayersSkeleton />
          ) : error ? (
            <div className="rounded-lg border border-red-800 bg-red-950 p-6 text-center text-red-400">
              <p>Error loading players: {error}</p>
            </div>
          ) : players.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p>No players found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <TopPlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="w-full">
          {isLoading ? (
            <TopPlayersSkeleton />
          ) : error ? (
            <div className="rounded-lg border border-red-800 bg-red-950 p-6 text-center text-red-400">
              <p>Error loading players: {error}</p>
            </div>
          ) : players.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p>No players found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <TopPlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="control" className="w-full">
          {isLoading ? (
            <TopPlayersSkeleton />
          ) : error ? (
            <div className="rounded-lg border border-red-800 bg-red-950 p-6 text-center text-red-400">
              <p>Error loading players: {error}</p>
            </div>
          ) : players.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p>No players found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <TopPlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TopPlayersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="relative h-[250px] w-full overflow-hidden bg-zinc-800">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="p-4">
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="mb-4 h-4 w-24" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
