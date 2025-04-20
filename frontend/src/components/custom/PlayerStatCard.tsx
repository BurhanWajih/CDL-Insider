import React from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import { Table, TableBody, TableCell, TableRow } from '../ui/table'
import { PlayerStat } from '@/lib/types'
import { Button } from '../ui/button'
import Link from 'next/link'

interface PlayerStatCardProps {
    title: string,
    stats: PlayerStat[]
}

const PlayerStatCard = ({ title, stats }: PlayerStatCardProps) => {
    return (
        <Card className='w-80 pt-0 overflow-clip drop-shadow-normal hover:drop-shadow-hover'>
            <div className="w-full flex flex-col gap-2">
                <div className="w-full flex h-50 overflow-clip">
                    <div className="w-1/2 flex flex-col gap-5 items-start">
                        <div className="w-full px-2 bg-foreground text-background text-lg font-bold text-start">
                            <p className='overflow-ellipsis line-clamp-1'>{title.toUpperCase()}</p>
                        </div>
                        <div className="w-full flex gap-3 pl-6 justify-start items-center">
                            <Image
                                className='h-10 w-10 object-contain'
                                height={10}
                                width={10}
                                src={stats[0].player.team.logoUrl}
                                alt={`${stats[0].player.team.name} logo`} />
                            <p className="text-card-muted-foreground">{stats[0].player.name}</p>
                        </div>
                        <p className="pl-6 text-5xl font-semibold">{stats[0].statValue}</p>
                    </div>
                    <div
                        style={{ backgroundColor: stats[0].player.team.themeColor }}
                        className={`w-1/2 h-full bg-[${stats[0].player.team.themeColor}]`}>
                        <Image
                            className="h-full w-full object-cover"
                            width={500}
                            height={500}
                            src={stats[0].player.imageUrl}
                            alt={`${stats[0].player.name} image`} />
                    </div>
                </div>
                <Separator className='-mt-2' />
                <Table>
                    <TableBody className='**:p-2'>
                        {stats.slice(1, 5).map((stat, idx) => (
                            <TableRow key={idx}>
                                <TableCell className='font-bold w-1/5'>{idx + 2}</TableCell>
                                <TableCell className='w-3/5 flex justify-start items-center'>
                                    <Image
                                        className='h-full'
                                        height={50} width={50}
                                        src={stat.player.imageUrl}
                                        alt={`${stat.player.name} image`} />
                                    <p>{stat.player.name}</p>
                                </TableCell>
                                <TableCell className='w-1/5 font-bold'>{stat.statValue}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant="link" asChild>
                    <Link href={'#'}>SEE ALL</Link>
                </Button>
            </div>
        </Card>
    )
}

export default PlayerStatCard