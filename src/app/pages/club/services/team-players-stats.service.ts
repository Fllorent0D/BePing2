import {Injectable} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {TeamPlayersStats, TeamPlayerStats} from '../model/team-players-stats.model';
import {TeamEntry} from '../../../core/api/models/team-entry';
import {ClubEntry} from '../../../core/api/models/club-entry';
import {Players} from '../../../core/api/models/players';

@Injectable({
    providedIn: 'root'
})
export class TeamPlayersStatsService {

    constructor() {
    }

    computeTeamPlayersStats(matches: TeamMatchesEntry[], team: TeamEntry, club: ClubEntry): TeamPlayersStats {
        const matchesPlayed = matches.filter((match) =>
            match.MatchDetails.DetailsCreated &&
            match.IsHomeForfeited === false &&
            match.IsAwayForfeited === false
        );
        console.log(matchesPlayed);

        return Object.values(matchesPlayed.reduce<{ [key: number]: TeamPlayerStats }>((acc, match) => {
            const teamName = (club.Name + ' ' + team.Team).trim();
            const teamPosition = match.HomeTeam === teamName ? 'Home' : 'Away';
            const oppositeTeam = teamPosition === 'Home' ? 'Away' : 'Home';
            const playerList: Players = match.MatchDetails[teamPosition + 'Players'];
            const awayPlayerList: Players = match.MatchDetails[oppositeTeam + 'Players'];
            const awayPlayerCount = awayPlayerList.Players.filter(p => !p.IsForfeited).length;
            for (const player of playerList.Players) {
                if (!acc[player.UniqueIndex]) {
                    acc[player.UniqueIndex] = {
                        name: player.FirstName + ' ' + player.LastName,
                        memberUniqueIndex: player.UniqueIndex,
                        ranking: player.Ranking,
                        matchesWon: 0,
                        matchesPlayed: 0,
                        matchesLost: 0,
                        lostPct: 0,
                        winPct: 0
                    };
                }

                acc[player.UniqueIndex].matchesWon = acc[player.UniqueIndex].matchesWon + player.VictoryCount;
                acc[player.UniqueIndex].matchesPlayed = acc[player.UniqueIndex].matchesPlayed + awayPlayerCount;
                acc[player.UniqueIndex].matchesLost = acc[player.UniqueIndex].matchesPlayed - acc[player.UniqueIndex].matchesWon;
                acc[player.UniqueIndex].winPct = Math.ceil(
                    (acc[player.UniqueIndex].matchesWon / acc[player.UniqueIndex].matchesPlayed) * 100
                );
                acc[player.UniqueIndex].lostPct = Math.ceil(
                    (acc[player.UniqueIndex].matchesLost / acc[player.UniqueIndex].matchesPlayed) * 100
                );
            }
            console.log(playerList);

            return acc;
        }, {})).sort((statA, statB) => statB.matchesPlayed - statA.matchesPlayed);
    }

}
