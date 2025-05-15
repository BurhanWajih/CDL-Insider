import HeroCarousel from "@/components/hero-carousel"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TopPlayersSection from "@/components/top-players-section"

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[600px] w-full overflow-hidden bg-zinc-900">
        <HeroCarousel />
      </div>

      <div className="container mx-auto mt-16 px-4 md:px-6">
        <TopPlayersSection />

        <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold">Explore Call of Duty League Statistics</h2>
          <p className="max-w-2xl text-zinc-400">
            Dive into comprehensive player and team statistics from the Call of Duty League 2025 season.
          </p>
          <div className="mt-4 pb-8 flex flex-wrap justify-center gap-4">
            <Link href="/player-stats">
              <Button className="bg-orange-500 text-white hover:bg-orange-600">View Player Stats</Button>
            </Link>
            <Link href="/teams-standings">
              <Button variant="outline">View Team Standings</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
