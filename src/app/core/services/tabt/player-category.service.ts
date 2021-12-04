import {Injectable} from '@angular/core';
import {MemberEntry} from '../../api/models/member-entry';
import {MEMBER_CATEGORY_STRING, PLAYER_CATEGORY} from '../../models/user';
import {combineLatest, Observable, of} from 'rxjs';
import {MembersService} from '../../api/services/members.service';
import {catchError, map} from 'rxjs/operators';
import {MatchesService} from '../../api/services/matches.service';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {UserMemberEntries} from '../../store/user/user.state';
import {WeeklyNumericRanking} from '../../api/models/weekly-numeric-ranking';

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

    static getMainCategory(memberEntries: UserMemberEntries, preferredCategory?: PLAYER_CATEGORY): PLAYER_CATEGORY {

        const playedCategories = PlayerCategoryService.getPlayedCategories(memberEntries);

        if (playedCategories.find((cat: PLAYER_CATEGORY) => cat === preferredCategory)) {
            return preferredCategory;
        }
        const weight = [
            PLAYER_CATEGORY.MEN, PLAYER_CATEGORY.WOMEN,
            PLAYER_CATEGORY.VETERANS, PLAYER_CATEGORY.VETERANS_WOMEN, PLAYER_CATEGORY.YOUTH
        ];
        const weightedCategories = weight.filter(cat => playedCategories.includes(cat));
        if (weightedCategories.length === 1) {
            return weightedCategories[0];
        }
        if (weightedCategories.length === 0) {
            return PLAYER_CATEGORY.MEN;
        }

        return weightedCategories.reduce((acc: PLAYER_CATEGORY, playerCategory: PLAYER_CATEGORY) => {
            if ((memberEntries[playerCategory].ResultEntries?.length ?? 0) > memberEntries[acc].ResultEntries?.length ?? 0) {
                return playerCategory;
            }
            return acc;

        }, weightedCategories[0]);
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
                catchError(() => of({category, found: false}))
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

    getMemberNumericRankings(memberEntries: UserMemberEntries): Observable<{ [key: string]: WeeklyNumericRanking[] }> {
        const getRankings = (uniqueIndex: number, category: MEMBER_CATEGORY_STRING) =>
            this.membersService.findMemberNumericRankingsHistory({uniqueIndex, category});
        const memberEntriesArray = Object.entries(memberEntries).filter(([cat]) => ['MEN', 'WOMEN'].includes(cat));
        return combineLatest(
            memberEntriesArray.map(([category, memberEntry]) =>
                getRankings(memberEntry.UniqueIndex, category as MEMBER_CATEGORY_STRING).pipe(
                    map((rankingHistory: WeeklyNumericRanking[]) => ([category, rankingHistory])),
                    catchError(() => of([category, []]))
                )
            )
        ).pipe(
            map((results: [string, WeeklyNumericRanking[]][]) => Object.fromEntries(results))
        );
    }

    getMemberLatestMatches(members: UserMemberEntries): Observable<{ [key: string]: TeamMatchesEntry[] }> {
        const clubIndexes = [...new Set(Object.values(members).map((entry) => entry?.Club))];
        const matchIds = Object.values(members)
            .map((entry) => [...(entry.ResultEntries ?? [])]
                .sort((a, b) => b.Date.localeCompare(a.Date))
                .map((result) => result.MatchId)
                .filter((item, pos, arr) => arr.indexOf(item) === pos)
                .slice(0, 3)
            )
            // @ts-ignore
            .flat();

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
