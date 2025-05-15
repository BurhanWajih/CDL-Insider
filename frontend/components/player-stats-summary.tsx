import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Trophy, Target, Clock, Bomb, Skull, Heart, Shield, Zap } from "lucide-react"
import type { Player } from "@/lib/api"

interface PlayerStatsSummaryProps {
  player: Player
}

export default function PlayerStatsSummary({ player }: PlayerStatsSummaryProps) {
  const { stats, seasonStats } = player

  // Calculate percentages for progress bars
  const kdRatioPercentage = Math.min((seasonStats.kdRatio / 2) * 100, 100)
  const accuracyPercentage = seasonStats.accuracy
  const winRatePercentage = seasonStats.winRate

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-zinc-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Season Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="mr-2 h-4 w-4 text-orange-500" />
                  <span className="text-sm text-zinc-400">K/D Ratio</span>
                </div>
                <span className="font-bold">{seasonStats.kdRatio.toFixed(2)}</span>
              </div>
              <Progress value={kdRatioPercentage} className="h-2 bg-zinc-800" indicatorClassName="bg-orange-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-orange-500" />
                  <span className="text-sm text-zinc-400">Accuracy</span>
                </div>
                <span className="font-bold">{seasonStats.accuracy}%</span>
              </div>
              <Progress value={accuracyPercentage} className="h-2 bg-zinc-800" indicatorClassName="bg-orange-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4 text-orange-500" />
                  <span className="text-sm text-zinc-400">Win Rate</span>
                </div>
                <span className="font-bold">{seasonStats.winRate}%</span>
              </div>
              <Progress value={winRatePercentage} className="h-2 bg-zinc-800" indicatorClassName="bg-orange-500" />
            </div>

            <Separator className="my-4 bg-zinc-800" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Matches</span>
                <span className="text-xl font-bold">{seasonStats.matches}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Maps Played</span>
                <span className="text-xl font-bold">{seasonStats.mapsPlayed}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Maps Won</span>
                <span className="text-xl font-bold">{seasonStats.mapsWon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Maps Lost</span>
                <span className="text-xl font-bold">{seasonStats.mapsLost}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Combat Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400">Kills</span>
              <span className="text-xl font-bold">{stats.kills}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400">Deaths</span>
              <span className="text-xl font-bold">{stats.deaths}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400">Assists</span>
              <span className="text-xl font-bold">{stats.assists}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400">Headshots</span>
              <span className="text-xl font-bold">{stats.headshots}</span>
            </div>
          </div>

          <Separator className="my-4 bg-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Skull className="mr-2 h-4 w-4 text-orange-500" />
                <span className="text-sm">First Bloods</span>
              </div>
              <span className="font-bold">{stats.firstBloods}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="mr-2 h-4 w-4 text-orange-500" />
                <span className="text-sm">Damage Per Minute</span>
              </div>
              <span className="font-bold">{stats.damagePerMinute}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4 text-orange-500" />
                <span className="text-sm">Damage Taken Per Minute</span>
              </div>
              <span className="font-bold">{stats.damageTakenPerMinute}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Game Mode Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 flex items-center text-sm font-medium">
                <Target className="mr-2 h-4 w-4 text-orange-500" />
                Hardpoint
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">Time</span>
                  <span className="font-bold">{stats.hardpointTime}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">K/D</span>
                  <span className="font-bold">{stats.hardpointKD.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Separator className="my-2 bg-zinc-800" />

            <div>
              <h3 className="mb-2 flex items-center text-sm font-medium">
                <Bomb className="mr-2 h-4 w-4 text-orange-500" />
                Search & Destroy
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">Plants</span>
                  <span className="font-bold">{stats.bombsPlanted}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">Defuses</span>
                  <span className="font-bold">{stats.bombsDefused}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">First Bloods</span>
                  <span className="font-bold">{stats.sndFirstBloods}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">K/D</span>
                  <span className="font-bold">{stats.sndKD.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Separator className="my-2 bg-zinc-800" />

            <div>
              <h3 className="mb-2 flex items-center text-sm font-medium">
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                Control
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">Points</span>
                  <span className="font-bold">{stats.controlPoints}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">K/D</span>
                  <span className="font-bold">{stats.controlKD.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
