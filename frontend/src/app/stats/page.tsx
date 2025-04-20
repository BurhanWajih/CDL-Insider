import PlayerStatCard from '@/components/custom/PlayerStatCard'
import { PlayerStat } from '@/lib/types'
import React from 'react'

// Example StatCard Values
const topKills: PlayerStat[] = [
  {
    player: { name: 'Hydra', imageUrl: '/images/test/player1.png', team: { name: 'Los Angeles Thieves', logoUrl: '/images/test/team1.png', themeColor: '#e9004e' } },
    statValue: 4015
  },
  {
    player: { name: 'aBeZy', imageUrl: '/images/test/player1.png', team: { name: 'Los Angeles Thieves', logoUrl: '/images/test/team1.png', themeColor: '#e9004e' } },
    statValue: 3791
  },
  {
    player: { name: 'Scrap', imageUrl: '/images/test/player1.png', team: { name: 'Los Angeles Thieves', logoUrl: '/images/test/team1.png', themeColor: '#e9004e' } },
    statValue: 3703
  },
  {
    player: { name: 'KiSMET', imageUrl: '/images/test/player1.png', team: { name: 'Los Angeles Thieves', logoUrl: '/images/test/team1.png', themeColor: '#ff0000' } },
    statValue: 3666
  },
  {
    player: { name: 'Simp', imageUrl: '/images/test/player1.png', team: { name: 'Los Angeles Thieves', logoUrl: '/images/test/team1.png', themeColor: '#e9004e' } },
    statValue: 3650
  },
]

const Stats = () => {
  return (
    <div className="mt-21 w-full p-5 md:p-50 flex flex-col items-center gap-5 md:gap-10 text-center">
      <h1 className="text-2xl font-bold drop-shadow-normal">Player Stats</h1>
      <PlayerStatCard title="kills" stats={topKills}/>
      <PlayerStatCard title="untraded kills" stats={topKills}/>
      <PlayerStatCard title="best k/d ratio" stats={topKills}/>
      <PlayerStatCard title="best kill streak" stats={topKills}/>
      <PlayerStatCard title="assists" stats={topKills}/>
      <PlayerStatCard title="hardpoint hill time" stats={topKills}/>
      <PlayerStatCard title="contested hill time" stats={topKills}/>
      <PlayerStatCard title="control zone captures" stats={topKills}/>

    </div>
  )
}

export default Stats