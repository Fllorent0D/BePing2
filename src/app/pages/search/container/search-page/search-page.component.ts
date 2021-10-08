import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {combineLatest, iif, Observable, of} from 'rxjs';
import {debounceTime, map, mergeMap, share, shareReplay, startWith, take, tap} from 'rxjs/operators';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {Store} from '@ngxs/store';
import {ClubsState} from '../../../../core/store/clubs';
import {DivisionEntry} from '../../../../core/api/models/division-entry';
import {DivisionsState} from '../../../../core/store/divisions';
import {MembersService} from '../../../../core/api/services/members.service';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';

interface SearchResults<T> {
    results?: T[];
    isLoading: boolean;
}

@Component({
    selector: 'beping-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

    searchControl: FormControl;

    searchInput$: Observable<string>;
    clubsFound$: Observable<SearchResults<ClubEntry>>;
    divisionsFound$: Observable<SearchResults<DivisionEntry>>;
    matchesFound$: Observable<SearchResults<TeamMatchesEntry>>;
    membersFound$: Observable<SearchResults<MemberEntry>>;

    noResult$: Observable<boolean>;
    introScreen$: Observable<boolean>;
    matchLoading = false;

    constructor(
        private readonly store: Store,
        private readonly memberService: MembersService,
        private readonly matchesService: MatchesService,
        private readonly tabNavigator: TabsNavigationService,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    ngOnInit() {
        const matchSheetRegex = new RegExp('([a-zA-Z]+)([0-9]{2})\/([0-9]+)');

        this.searchControl = new FormControl();
        this.searchInput$ = this.searchControl.valueChanges.pipe(
            debounceTime(1000),
            tap((terms: string) => this.analyticsService.logEvent('search', {search_term: terms})),
            shareReplay(1),
            startWith('')
        );

        this.clubsFound$ = this.searchInput$.pipe(
            mergeMap(val =>
                iif(
                    () => (val?.length > 2),
                    this.store.select(ClubsState.searchClub(val)).pipe(
                        take(1),
                        map((res) => ({isLoading: false, results: res})),
                        startWith({isLoading: true})
                    ),
                    of({isLoading: false, results: []})
                )
            ),
            startWith({isLoading: false}),
            share()
        );

        this.divisionsFound$ = this.searchInput$.pipe(
            mergeMap(val =>
                iif(
                    () => (val?.length > 1),
                    this.store.select(DivisionsState.searchDivision(val)).pipe(
                        take(1),
                        map((res) => ({isLoading: false, results: res})),
                        startWith({isLoading: true})
                    ),
                    of({isLoading: false, results: []})
                )
            ),
            startWith({isLoading: false}),
            share()
        );

        this.membersFound$ = this.searchInput$.pipe(
            mergeMap(val =>
                iif(
                    () => !!(val?.length > 3 && !/\d/.test(val)),
                    this.memberService.findAllMembers({
                        nameSearch: val
                    }).pipe(
                        map((results) => ({isLoading: false, results})),
                        startWith({isLoading: true})
                    ),
                    of({isLoading: false, results: []})
                )
            ),
            startWith({isLoading: false}),
            share()
        );


        this.matchesFound$ = this.searchInput$.pipe(
            mergeMap(val => {
                    const groups = val.match(matchSheetRegex);
                    console.log(val, groups, matchSheetRegex.test(val));
                    return iif(
                        () => matchSheetRegex.test(val),
                        this.matchesService.findAllMatches({
                            matchId: val,
                            weekName: Number(groups?.[2])
                        }).pipe(
                            map((results) => ({isLoading: false, results})),
                            startWith({isLoading: true})
                        ),
                        of({isLoading: false, results: []})
                    );
                }
            ),
            startWith({isLoading: false}),
            share()
        );

        this.noResult$ = combineLatest([
            this.matchesFound$,
            this.membersFound$,
            this.divisionsFound$,
            this.clubsFound$,
            this.searchInput$
        ]).pipe(
            map(([matches, members, divisions, clubs, val]) => {
                return matches.isLoading === false &&
                    divisions.isLoading === false &&
                    members.isLoading === false &&
                    clubs.isLoading === false &&
                    matches.results?.length === 0 &&
                    divisions.results?.length === 0 &&
                    members.results?.length === 0 &&
                    clubs.results?.length === 0 &&
                    val.length > 0;
            })
        );

        this.introScreen$ = this.searchInput$.pipe(
            map((val) => val.length === 0)
        );

    }

    clubClicked(club: ClubEntry) {
        this.tabNavigator.navigateTo(['clubs', club.UniqueIndex]);
    }

    memberClicked(member: MemberEntry) {
        this.tabNavigator.navigateTo(['player', member.UniqueIndex.toString(10)]);

    }

    divisionClicked(division: DivisionEntry) {
        this.tabNavigator.navigateTo(['divisions', division.DivisionId.toString(10)]);
    }

    matchClicked(teamMatchEntry: TeamMatchesEntry) {
        this.tabNavigator.navigateTo(['team-match-details', teamMatchEntry.MatchUniqueId.toString(10)]);
    }

}
