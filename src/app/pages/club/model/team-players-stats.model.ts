export interface TeamPlayerStats {
    name: string;
    memberUniqueIndex: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    winPct: number;
    lostPct: number;
    ranking: string;
}

export type TeamPlayersStats = Array<TeamPlayerStats>;
