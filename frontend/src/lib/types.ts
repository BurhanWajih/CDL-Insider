export interface PlayerStat {
    player: Player,
    statValue: number | string
}

export interface Player {
    name: string
    imageUrl: string
    team: Team
}

export interface Team {
    name: string,
    logoUrl: string,
    themeColor: string
}