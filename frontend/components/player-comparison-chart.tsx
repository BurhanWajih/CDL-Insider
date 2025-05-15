"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/types"

interface PlayerComparisonChartProps {
  player: Player
}

export default function PlayerComparisonChart({ player }: PlayerComparisonChartProps) {
  const [comparePlayer1, setComparePlayer1] = useState("")
  const [comparePlayer2, setComparePlayer2] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold">Player Comparison</h2>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Select value={comparePlayer1} onValueChange={setComparePlayer1}>
            <SelectTrigger className="w-[180px] bg-zinc-800">
              <SelectValue placeholder="Select Player 1" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800">
              <SelectItem value="player1">Player 1</SelectItem>
              <SelectItem value="player2">Player 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={comparePlayer2} onValueChange={setComparePlayer2}>
            <SelectTrigger className="w-[180px] bg-zinc-800">
              <SelectValue placeholder="Select Player 2" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800">
              <SelectItem value="player1">Player 1</SelectItem>
              <SelectItem value="player2">Player 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle>Visual Comparison Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
            <p className="text-zinc-400">
              Visual player comparison charts are currently being developed and will be available soon.
            </p>
            <Badge variant="outline" className="bg-zinc-800">
              Feature in Development
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
