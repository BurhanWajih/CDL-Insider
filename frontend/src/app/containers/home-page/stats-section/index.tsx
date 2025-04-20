import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

// Demo Teams Rank Data
const teamRanks = [
    {
      image: '/images/test/team2.png',
      teamName: 'Vancouver Surge'
    },
    {
      image: '/images/test/team1.png',
      teamName: 'Miami Heretics'
    },
    {
      image: '/images/test/team2.png',
      teamName: 'Toronto Ultra'
    },
    {
      image: '/images/test/team1.png',
      teamName: 'Los Angeles Thieves'
    },
    {
      image: '/images/test/team1.png',
      teamName: 'Boston Breach'
    },
  ]
  
  const topKillers = [
    {
      image: '/images/test/player1.png',
      name: 'Hydra',
      killCount: 4015
    },
    
    {
      image: '/images/test/player1.png',
      name: 'aBeZy',
      killCount: 3791
    },
    {
      image: '/images/test/player1.png',
      name: 'Scrap',
      killCount: 3703
    },
    {
      image: '/images/test/player1.png',
      name: 'KiSMET',
      killCount: 3666
    },
    {
      image: '/images/test/player1.png',
      name: 'Simp',
      killCount: 3650
    },
  ]

const StatsSection = () => {
    return (
        <div className="w-full h-screen flex flex-col lg:p-50 gap-5 md:gap-10 text-center" id='home-explore-stats'>
            <h1 className='text-2xl font-bold drop-shadow-normal'>League Leaders at a Glance</h1>
            <div className="mx-auto w-full flex flex-col lg:flex-row gap-10 justify-center align-middle text-center">
                <Card className='mx-auto w-10/12 lg:w-1/3 text-start drop-shadow-normal hover:drop-shadow-hover hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>Top 5 Ranked Teams</CardTitle>
                        <CardDescription>Five of the best CDL teams!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-1/4'>Rank</TableHead>
                                    <TableHead className='w-3/4'>Team</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamRanks.map((team, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-5 justify-start">
                                                <Image className='h-6 w-6 object-contain' height={10} width={20} src={team.image} alt={`${team.teamName} logo`} />
                                                <p>{team.teamName}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Button
                            className='w-full mt-3'
                            variant='link' asChild>
                            <Link href='/teams' className='hover:cursor-pointer'>See More</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className='mx-auto w-10/12 lg:w-2/3 text-start drop-shadow-normal hover:drop-shadow-hover hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>Players with the Most Kills</CardTitle>
                        <CardDescription>The unstoppable killing machines of CDL!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-1/6'>Rank</TableHead>
                                    <TableHead className='w-full'>Player</TableHead>
                                    <TableHead className='w-1/4'>Kills</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topKillers.map((player, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-5 justify-start">
                                                <Image className='h-6 w-6 object-contain' height={10} width={20} src={player.image} alt={`${player.name}'s picture`} />
                                                <p>{player.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {player.killCount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Button
                            className='w-full mt-3'
                            variant='link' asChild>
                            <Link href='/stats' className='hover:cursor-pointer'>Go to Stats</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default StatsSection