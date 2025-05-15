import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getPlayerImageUrl, getTeamImageUrl, handleImageError } from "@/lib/image-utils"
import type { Player } from "@/lib/types"

interface TopPlayerCardProps {
  player: Player & { statValue: number }
}

export default function TopPlayerCard({ player }: TopPlayerCardProps) {
  // Create a slug from the player name
  const playerSlug = player.name.toLowerCase().replace(/\s+/g, "-")

  return (
    <Card className="overflow-hidden bg-zinc-900 text-white">
      <div className="relative h-[250px] w-full overflow-hidden bg-gradient-to-r from-zinc-800 to-zinc-900">
        <Image
          src={getPlayerImageUrl(player.name) || "/placeholder.svg?height=300&width=300"}
          alt={player.name}
          fill
          className="object-cover object-center"
          onError={(e) => handleImageError(e, 300, 300)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center">
            {player.team && (
              <Image
                src={getTeamImageUrl(player.team.slug) || "/placeholder.svg?height=32&width=32"}
                alt={player.team.teamName}
                width={32}
                height={32}
                className="mr-2 h-8 w-8"
                onError={(e) => handleImageError(e, 32, 32)}
              />
            )}
            <h3 className="text-xl font-bold">{player.name}</h3>
          </div>
          <p className="text-sm text-zinc-400">{player.team ? player.team.teamName : "Free Agent"}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400">K/D Ratio</span>
            <span className="text-xl font-bold">{player.statValue.toFixed(2)}</span>
          </div>
          {player.currentSeasonStats && (
            <>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Rating</span>
                <span className="text-xl font-bold">
                  {player.currentSeasonStats.overall_rating?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Rank</span>
                <span className="text-xl font-bold">#{player.currentSeasonStats.Player_Rank || "N/A"}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-zinc-800 p-4">
        <Link
          href={`/players/${playerSlug}`}
          className="w-full rounded-md bg-zinc-800 py-2 text-center font-medium hover:bg-zinc-700"
        >
          View Full Stats
        </Link>
      </CardFooter>
    </Card>
  )
}
