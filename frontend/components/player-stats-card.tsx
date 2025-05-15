import Image from "next/image"

interface PlayerStatsCardProps {
  title: string
  player: {
    name: string
    team: string
    teamLogo: string
    value: number
    image: string
  }
}

export default function PlayerStatsCard({ title, player }: PlayerStatsCardProps) {
  return (
    <div className="overflow-hidden rounded-t-lg bg-zinc-900">
      <div className="relative flex h-[200px] w-full">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="z-20 flex w-1/2 flex-col justify-center p-4">
          <h2 className="mb-2 text-xl font-bold">{title}</h2>
          <div className="mb-2 flex items-center">
            <Image
              src={player.teamLogo || "/placeholder.svg"}
              alt={player.team}
              width={24}
              height={24}
              className="mr-2 h-6 w-6"
            />
            <span className="text-lg font-medium">{player.name}</span>
          </div>
          <div className="text-4xl font-bold">{player.value}</div>
        </div>
        <div className="relative ml-auto h-full w-1/2 overflow-hidden bg-rose-600">
          <Image
            src={player.image || "/placeholder.svg"}
            alt={player.name}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  )
}
