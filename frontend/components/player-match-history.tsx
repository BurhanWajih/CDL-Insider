"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/types"

interface PlayerMatchHistoryProps {
  player: Player
}

export default function PlayerMatchHistory({ player }: PlayerMatchHistoryProps) {
  const [filter, setFilter] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Match History</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-zinc-800">
            <SelectValue placeholder="Filter Matches" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800">
            <SelectItem value="all">All Matches</SelectItem>
            <SelectItem value="wins">Wins Only</SelectItem>
            <SelectItem value="losses">Losses Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle>Match Data Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
            <p className="text-zinc-400">Match history data is currently being processed and will be available soon.</p>
            <Badge variant="outline" className="bg-zinc-800">
              Feature in Development
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}