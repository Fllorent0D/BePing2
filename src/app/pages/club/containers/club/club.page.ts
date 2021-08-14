import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {map, share, switchMap, take, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {ClubMembersListService} from '../../../../core/services/tabt/club-members-list.service';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {VenueEntry} from '../../../../core/api/models/venue-entry';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {AbstractPageTabsComponent} from '../../../../shared/helpers/abstract-page-tabs/abstract-page-tabs.component';
import {add, format, sub} from 'date-fns';
import {FavoritesState, ToggleClubFromFavorites} from '../../../../core/store/favorites';

@Component({
    selector: 'beping-club',
    templateUrl: './club.page.html',
    styleUrls: ['./club.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubPage extends AbstractPageTabsComponent implements OnInit {
    club$: Observable<ClubEntry>;
    members$: Observable<MemberEntry[]>;
    venues$: Observable<VenueEntry[]>;
    teams$: Observable<TeamEntry[]>;
    matches$: Observable<TeamMatchesEntry[]>;
    matches: TeamMatchesEntry[] = [];
    from$: BehaviorSubject<Date>;
    to$: BehaviorSubject<Date>;

    isFavorite$: Observable<boolean>;

    loadLater: Observable<TeamMatchesEntry[]>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly store: Store,
        private readonly tabsNavigationService: TabsNavigationService,
        private readonly clubService: ClubsService,
        private readonly matchesService: MatchesService,
        private readonly clubMembersListService: ClubMembersListService,
        protected readonly changeDetectionRef: ChangeDetectorRef
    ) {
        super(changeDetectionRef);

        this.from$ = new BehaviorSubject<Date>(sub(new Date(), {weeks: 2}));
        this.to$ = new BehaviorSubject<Date>(new Date());
    }

    ngOnInit() {

        this.club$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => params.get('uniqueIndex') as string),
            switchMap((uniqueIndex: string) => this.store.select(ClubsState.getClubByUniqueIndex(uniqueIndex)))
        );

        this.isFavorite$ = this.club$.pipe(
            switchMap((club) => this.store.select(FavoritesState.isClubInFavorite(club.UniqueIndex)))
        );

        this.teams$ = this.club$.pipe(
            switchMap((club) => this.clubService.findClubTeams({clubIndex: club.UniqueIndex}))
        );

        this.matches$ = this.club$.pipe(
            switchMap((club) => this.matchesService.findAllMatches({club: club.UniqueIndex}))
        );

        /*
                this.matches$ = combineLatest([
                    this.club$,
                    this.fromToDate$
                ]).pipe(
                    switchMap(([club, {to, from}]) => this.matchesService.findAllMatches({
                        club: club.UniqueIndex,
                        yearDateFrom: format(from, 'yyyy-LL-dd'),
                        yearDateTo: format(to, 'yyyy-LL-dd')
                    })),
                    map((matches: TeamMatchesEntry[]) => matches.filter(
                        (m) => !this.matches.find((alreadyExisting) => alreadyExisting.MatchUniqueId === m.MatchUniqueId)
                    )),
                    tap((newMatches) => {
                        if (this.matches.length <= 5) {
                            this.loadMore();
                        }
                    }),
                    share()
                );

         */
        /*
        this.loadLater = combineLatest([this.club$, this.to$])
            .pipe(
                switchMap(([club, to]) => this.matchesService.findAllMatches({
                    club: club.UniqueIndex,
                    yearDateFrom: format(add(to, {days: 1}), 'yyyy-LL-dd'),
                    yearDateTo: format(add(to, {weeks: 2}), 'yyyy-LL-dd')
                })),
                map((matches: TeamMatchesEntry[]) => matches.sort((a, b) => a.Date > b.Date ? 1 : -1)),
                share()
            );

        this.loadLater.subscribe((test) => {
            this.matches.push(...test);
            if (this.matches.length < 10) {
                this.loadLaterMatches();
            }
            this.changeDetectionRef.markForCheck();
        });*/

        this.venues$ = this.club$.pipe(
            map((club) => club.VenueEntries)
        );

        this.members$ = this.club$.pipe(
            switchMap((club: ClubEntry) => this.clubService.findClubMembers({clubIndex: club.UniqueIndex})),
            map((members: MemberEntry[]) => this.clubMembersListService.transformToClubMembersList(members))
        );
    }

    navigateToPlayer(uniqueIndex: number) {
        this.tabsNavigationService.navigateTo(['player', uniqueIndex.toString(10)]);
    }

    navigateToTeamPage(team: TeamEntry, club: ClubEntry) {
        this.router.navigate(['.', 'team', team.TeamId], {
            state: {club, team}
        });
    }

    updateTabIndex(event) {
        console.log(event);
    }


    loadLaterMatches(event?) {
        this.to$.next(add(this.to$.value, {weeks: 2}));

        if (event) {
            this.loadLater.pipe(
                take(1)
            ).subscribe(() => {
                event.target.complete();
            });
        }
    }

    loadEarlierMatches(event) {
        /*
        this.fromToDate$.next({
            ...this.fromToDate$.value,
            from: sub(this.fromToDate$.value.from, {weeks: 1})
        });
        if (event) {
            this.matches.pipe(
                take(1)
            ).subscribe(() => event.target.complete());
        }


         */
    }

    toggleClubFavorite() {
        this.club$.pipe(
            take(1)
        ).subscribe((club) => this.store.dispatch(new ToggleClubFromFavorites(club.UniqueIndex)));

    }
}

