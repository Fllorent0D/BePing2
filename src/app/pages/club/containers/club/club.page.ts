import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {map, switchMap, take} from 'rxjs/operators';
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
import {add, sub} from 'date-fns';
import {FavoritesState, ToggleClubFromFavorites} from '../../../../core/store/favorites';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {ImpactStyle} from '@capacitor/haptics';
import {HapticsService} from '../../../../core/services/haptics.service';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';

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
    CATEGORIES = [PLAYER_CATEGORY.MEN, PLAYER_CATEGORY.WOMEN, PLAYER_CATEGORY.YOUTH, PLAYER_CATEGORY.VETERANS];
    currentCategory$: ReplaySubject<PLAYER_CATEGORY> = new ReplaySubject<PLAYER_CATEGORY>(1);

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly store: Store,
        private readonly tabsNavigationService: TabsNavigationService,
        private readonly clubService: ClubsService,
        private readonly matchesService: MatchesService,
        private readonly clubMembersListService: ClubMembersListService,
        protected readonly changeDetectionRef: ChangeDetectorRef,
        private readonly hapticService: HapticsService,
        private readonly analyticsService: AnalyticsService
    ) {
        super(changeDetectionRef);

        this.from$ = new BehaviorSubject<Date>(sub(new Date(), {weeks: 2}));
        this.to$ = new BehaviorSubject<Date>(new Date());
    }

    ngOnInit() {
        this.currentCategory$.next(PLAYER_CATEGORY.MEN);

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

        //this.matches$ = this.club$.pipe(
        //   switchMap((club) => this.matchesService.findAllMatches({club: club.UniqueIndex})),
        //);

        this.venues$ = this.club$.pipe(
            map((club) => club.VenueEntries)
        );

        this.members$ = combineLatest([
            this.currentCategory$,
            this.club$
        ]).pipe(
            switchMap(([category, club]) => this.clubService.findClubMembers({clubIndex: club.UniqueIndex, playerCategory: category})),
            map((members: MemberEntry[]) => this.clubMembersListService.transformToClubMembersList(members))
        );

    }

    async categoryClicked(category: PLAYER_CATEGORY) {
        this.analyticsService.logEvent('member_category_changed');
        this.hapticService.hapticsImpact(ImpactStyle.Medium);
        this.currentCategory$.next(category);
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

    getIcon(category: PLAYER_CATEGORY) {
        switch (category) {
            case PLAYER_CATEGORY.MEN:
            case PLAYER_CATEGORY.VETERANS:
                return 'male-outline';
            case PLAYER_CATEGORY.WOMEN:
            case PLAYER_CATEGORY.VETERANS_WOMEN:
                return 'female-outline';
            case PLAYER_CATEGORY.YOUTH:
                return 'happy-outline';
        }
    }

    toggleClubFavorite() {
        this.club$.pipe(
            take(1),
            switchMap((club: ClubEntry) => this.store.dispatch(new ToggleClubFromFavorites(club)))
        ).subscribe();
    }
}

