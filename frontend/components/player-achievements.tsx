import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/types"

interface PlayerAchievementsProps {
  player: Player
}

export default function PlayerAchievements({ player }: PlayerAchievementsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6 text-2xl font-bold">Achievements & Accolades</h2>
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle>Achievements Data Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
              <p className="text-zinc-400">
                Player achievements and accolades data is currently being processed and will be available soon.
              </p>
              <Badge variant="outline" className="bg-zinc-800">
                Feature in Development
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
