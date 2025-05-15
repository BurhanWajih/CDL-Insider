"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/types"

interface PlayerStatsDetailedProps {
  player: Player
}

export default function PlayerStatsDetailed({ player }: PlayerStatsDetailedProps) {
  const [selectedSeason, setSelectedSeason] = useState("current")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Detailed Statistics</h2>
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-[180px] bg-zinc-800">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800">
            <SelectItem value="current">Current Season</SelectItem>
            <SelectItem value="2024">2024 Season</SelectItem>
            <SelectItem value="2023">2023 Season</SelectItem>
            <SelectItem value="allTime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="weapons" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 bg-zinc-900">
          <TabsTrigger value="weapons">Weapons</TabsTrigger>
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="weapons" className="w-full">
          <Card className="bg-zinc-900">
            <CardHeader>
              <CardTitle>Weapon Data Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
                <p className="text-zinc-400">
                  Detailed weapon performance data is currently being processed and will be available soon.
                </p>
                <Badge variant="outline" className="bg-zinc-800">
                  Feature in Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maps" className="w-full">
          <Card className="bg-zinc-900">
            <CardHeader>
              <CardTitle>Map Data Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
                <p className="text-zinc-400">
                  Detailed map performance data is currently being processed and will be available soon.
                </p>
                <Badge variant="outline" className="bg-zinc-800">
                  Feature in Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="w-full">
          <Card className="bg-zinc-900">
            <CardHeader>
              <CardTitle>Performance Data Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
                <p className="text-zinc-400">
                  Detailed performance trend data is currently being processed and will be available soon.
                </p>
                <Badge variant="outline" className="bg-zinc-800">
                  Feature in Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
