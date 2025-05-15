import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Twitter, Instagram } from "lucide-react"
import type { Player } from "@/lib/api"

interface PlayerHeroProps {
  player: Player
}

export default function PlayerHero({ player }: PlayerHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-r from-zinc-900 to-black">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src={player.teamBackgroundImage || "/placeholder.svg?height=600&width=1200"}
          alt={player.team}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center p-6 md:flex-row md:items-start md:p-8">
        <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-lg border-4 md:mb-0 md:mr-8">
          <Image
            src={player.image || "/placeholder.svg?height=300&width=300"}
            alt={player.name}
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col text-center md:text-left">
          <div className="mb-2 flex items-center justify-center md:justify-start">
            <Image
              src={player.teamLogo || "/placeholder.svg?height=40&width=40"}
              alt={player.team}
              width={40}
              height={40}
              className="mr-3 h-10 w-10"
            />
            <h1 className="text-4xl font-bold">{player.name}</h1>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant="outline" className="border-orange-500 text-orange-500">
              {player.role}
            </Badge>
            <Badge variant="outline">{player.team}</Badge>
            <Badge variant="outline">#{player.number}</Badge>
          </div>

          <p className="mb-6 max-w-2xl text-zinc-400">{player.bio}</p>

          <div className="mt-auto flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Button variant="outline" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              <span>Favorite</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            {player.twitter && (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
            )}
            {player.instagram && (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center space-y-4 md:mt-0 md:items-end">
          <div className="flex items-center rounded-full bg-zinc-800 px-4 py-2">
            <span className="mr-2 text-sm text-zinc-400">World Rank:</span>
            <span className="text-lg font-bold">{player.worldRank}</span>
          </div>
          <div className="text-center">
            <div className="text-sm text-zinc-400">Season {player.season}</div>
            <div className="text-3xl font-bold">{player.seasonStats.kdRatio.toFixed(2)}</div>
            <div className="text-sm text-zinc-400">K/D Ratio</div>
          </div>
        </div>
      </div>
    </div>
  )
}
