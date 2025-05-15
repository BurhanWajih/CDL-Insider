import Image from "next/image"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TeamStandingsTableProps {
  teams: {
    id: number
    name: string
    logo: string
    wins: number
    losses: number
    winPercentage: number
    pointsDiff: number
  }[]
}

export default function TeamStandingsTable({ teams }: TeamStandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow>
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">Win %</TableHead>
            <TableHead className="text-center">+/-</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={team.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
              <TableCell className="text-center font-medium">{index + 1}</TableCell>
              <TableCell>
                <Link href={`/teams/${team.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center">
                  <Image
                    src={team.logo || "/placeholder.svg"}
                    alt={team.name}
                    width={32}
                    height={32}
                    className="mr-3 h-8 w-8"
                  />
                  <span className="font-medium">{team.name}</span>
                </Link>
              </TableCell>
              <TableCell className="text-center">{team.wins}</TableCell>
              <TableCell className="text-center">{team.losses}</TableCell>
              <TableCell className="text-center">{team.winPercentage.toFixed(3)}</TableCell>
              <TableCell
                className={`text-center ${team.pointsDiff > 0 ? "text-green-500" : team.pointsDiff < 0 ? "text-red-500" : ""}`}
              >
                {team.pointsDiff > 0 ? `+${team.pointsDiff}` : team.pointsDiff}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
