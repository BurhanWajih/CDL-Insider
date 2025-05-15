"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SearchBar from "@/components/search-bar"
import PlayerStatsTable from "@/components/player-stats-table"
import PlayerComparisonTool from "@/components/player-comparison-tool"
import { useSearchParams } from "next/navigation"
import type { StatCategory } from "@/lib/types"

export default function PlayerStatsPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<StatCategory>("overall")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Get the category from URL if available
    const categoryParam = searchParams.get("category") as StatCategory | null
    if (categoryParam && ["overall", "hardpoint", "search", "control"].includes(categoryParam)) {
      setSelectedCategory(categoryParam)
    }

    // Get the search query from URL if available
    const queryParam = searchParams.get("q")
    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [searchParams])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as StatCategory)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-center text-4xl font-bold">Player Stats</h1>

      <Card className="mb-8 bg-zinc-900">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <SearchBar placeholder="Search players..." onSearch={handleSearch} />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                <SelectItem value="hardpoint">Hardpoint</SelectItem>
                <SelectItem value="search">Search & Destroy</SelectItem>
                <SelectItem value="control">Control</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 bg-zinc-900">
          <TabsTrigger value="all">All Players</TabsTrigger>
          <TabsTrigger value="top10">Top 10</TabsTrigger>
          <TabsTrigger value="compare">Compare Players</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="w-full">
          <PlayerStatsTable category={selectedCategory} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="top10">
          <PlayerStatsTable category={selectedCategory} limit={10} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="compare">
          <PlayerComparisonTool />
        </TabsContent>
      </Tabs>
    </div>
  )
}
