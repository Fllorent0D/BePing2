import {Injectable} from '@angular/core';
import {MemberEntry} from '../../api/models/member-entry';
import {PLAYER_CATEGORY} from '../../models/user';
import {combineLatest, Observable, of} from 'rxjs';
import {MembersService} from '../../api/services/members.service';
import {catchError, map} from 'rxjs/operators';
import {MatchesService} from '../../api/services/matches.service';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {UserMemberEntries} from '../../store/user/user.state';

@Injectable({
    providedIn: 'root'
})
export class PlayerCategoryService {

    constructor(
        private readonly membersService: MembersService,
        private readonly matchesService: MatchesService
    ) {
    }

    static getPlayedCategories(memberEntries: UserMemberEntries): PLAYER_CATEGORY[] {
        return Object.keys(memberEntries) as PLAYER_CATEGORY[];
    }

    static getMainCategory(memberEntries: UserMemberEntries): PLAYER_CATEGORY {
        const playedCategories = PlayerCategoryService.getPlayedCategories(memberEntries);

        if (playedCategories.length === 1) {
            return playedCategories[0];
        }
        if (playedCategories.length === 0 || playedCategories.find((cat) => cat === PLAYER_CATEGORY.MEN)) {
            return PLAYER_CATEGORY.MEN;
        }
        return playedCategories[0];
    }

    getMemberPlayerCategories(memberUniqueIndex: number): Observable<UserMemberEntries> {
        const isCategory = (category: PLAYER_CATEGORY) =>
            this.membersService.findMemberById({
                playerCategory: category,
                uniqueIndex: memberUniqueIndex,
                withResults: true,
                rankingPointsInformation: true,
                withOpponentRankingEvaluation: true
            }).pipe(
                map((memberEntry: MemberEntry) => ({category, memberEntry, found: true})),
                catchError((err) => of({category, found: false}))
            );

        return combineLatest([
            isCategory(PLAYER_CATEGORY.YOUTH),
            isCategory(PLAYER_CATEGORY.MEN),
            isCategory(PLAYER_CATEGORY.WOMEN),
            isCategory(PLAYER_CATEGORY.VETERANS_WOMEN),
            isCategory(PLAYER_CATEGORY.VETERANS)
        ]).pipe(
            map((categories: { category: PLAYER_CATEGORY; found: boolean, memberEntry?: MemberEntry }[]) => {
                return categories.reduce((acc, value) => {
                    if (value.found) {
                        acc[value.category] = value.memberEntry;
                    }
                    return acc;
                }, {});
            })
        );
    }

    getMemberLatestMatches(members: UserMemberEntries): Observable<{ [key: string]: TeamMatchesEntry[] }> {
        const clubIndexes = [...new Set(Object.values(members).map((entry) => entry.Club))];
        const matchIds = Object.values(members)
            .map((entry) => [...(entry.ResultEntries ?? [])]
                .sort((a, b) => b.Date.localeCompare(a.Date))
                .map((result) => result.MatchId)
                .filter((item, pos, arr) => arr.indexOf(item) === pos)
                .slice(0, 3)
            )
            // @ts-ignore
            .flat();
        console.log(matchIds, members);

        return combineLatest(
            clubIndexes.map(clubIndex => this.matchesService.findAllMatches({club: clubIndex}))
        ).pipe(
            map((matches: TeamMatchesEntry[][]) =>
                // @ts-ignore
                matches.flat().filter((match) => matchIds.includes(match.MatchId))
            ),
            map((matches: TeamMatchesEntry[]) =>
                Object.entries(members).reduce((acc, [category, member]) => {
                    const results = member.ResultEntries ?? [];
                    const ids = results.map((result) => result.MatchId);
                    acc[category] = matches.filter((match) => ids.includes(match.MatchId));
                    return acc;
                }, {})
            )
        );
    }
}
