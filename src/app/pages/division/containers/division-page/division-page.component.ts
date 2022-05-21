import {AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AbstractPageTabsComponent} from '../../../../shared/helpers/abstract-page-tabs/abstract-page-tabs.component';
import {ActivatedRoute, Params} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {DivisionsService} from '../../../../core/api/services/divisions.service';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {combineLatest, Observable} from 'rxjs';
import {RankingEntry} from '../../../../core/api/models/ranking-entry';
import {map, share, shareReplay, switchMap, take} from 'rxjs/operators';
import {DivisionEntry} from '../../../../core/api/models/division-entry';
import {DivisionsState} from '../../../../core/store/divisions';
import {MemberResults} from '../../../../core/api/models/member-results';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {FavoritesState, ToggleDivisionFromFavorites} from '../../../../core/store/favorites';
import {CalendarService} from '../../../../core/services/calendar/calendar.service';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {TranslateService} from '@ngx-translate/core';
import {RemoteSettingsState} from '../../../../core/store/remote-settings';
import {IonRouterOutlet} from '@ionic/angular';
import SwiperCore, { SwiperOptions, Scrollbar } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Scrollbar]);

@Component({
    selector: 'beping-division-page',
    templateUrl: './division-page.component.html',
    styleUrls: ['./division-page.component.scss']
})
export class DivisionPageComponent extends AbstractPageTabsComponent implements OnInit, AfterViewInit {

    divisionId$: Observable<number>;
    ranking$: Observable<RankingEntry[]>;
    division$: Observable<DivisionEntry>;
    memberRanking$: Observable<MemberResults[]>;
    matches$: Observable<TeamMatchesEntry[]>;
    isFavorite$: Observable<boolean>;
    @Select(RemoteSettingsState.bepingProEnabled) bepingProEnabled$: Observable<boolean>;

    @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
    activeSwiperIndex = 0;

    swiperConfig: SwiperOptions = {
        speed: 150,
        scrollbar: {
            draggable: true,
            hide: false,
            dragClass: 'beping-swiper-scrollbar-drag',
            el: '.beping-swiper-scrollbar',
        },
    };
    

    constructor(
        protected readonly changeDetectionRef: ChangeDetectorRef,
        protected readonly activatedRouted: ActivatedRoute,
        protected readonly store: Store,
        protected readonly divisionService: DivisionsService,
        protected readonly matchesService: MatchesService,
        private readonly clubsService: ClubsService,
        private readonly tabsNavigation: TabsNavigationService,
        private readonly calendarService: CalendarService,
        private readonly dialogService: DialogService,
        private readonly translate: TranslateService,
        private readonly ionRouter: IonRouterOutlet,
        private readonly ngZone: NgZone,
    ) {
        super(changeDetectionRef);
    }

    ngOnInit() {
        this.divisionId$ = this.activatedRouted.params.pipe(
            map((params: Params) => Number(params.divisionId)),
            shareReplay(1)
        );

        this.isFavorite$ = this.divisionId$.pipe(
            switchMap((id) => this.store.select(FavoritesState.isDivisionInFavorite(id)))
        );

        this.ranking$ = this.divisionId$.pipe(
            switchMap((id: number) => this.divisionService.findDivisionRanking({divisionId: id}))
        );

        this.division$ = this.divisionId$.pipe(
            switchMap((id: number) => this.store.select(DivisionsState.getDivisionByUniqueIndex(id))),
            shareReplay(1)
        );

        this.memberRanking$ = this.divisionId$.pipe(
            switchMap((id: number) => this.divisionService.findDivisionMembers({divisionId: id})),
            share()
        );

        this.matches$ = this.divisionId$.pipe(
            switchMap((id: number) => this.matchesService.findAllMatches({divisionId: id, showDivisionName: 'short'})),
            shareReplay(1)
        );


    }

    ngAfterViewInit(): void {
        this.swiper.updateSwiper({});
    }

    slideChange([swiper]) {
        this.ngZone.run(() => this.activeSwiperIndex = swiper.activeIndex);
    }

    isSameTeam(rankingEntry: RankingEntry, team: TeamEntry, club: ClubEntry, divisionId: number): boolean {
        return rankingEntry.TeamClub === club.UniqueIndex &&
            divisionId === team.DivisionId &&
            rankingEntry.Team === (club.LongName + ' ' + team.Team).trim();
    }

    navigateToTeam(rankingEntry: RankingEntry) {
        combineLatest([
            this.store.select(ClubsState.getClubByUniqueIndex(rankingEntry.TeamClub)),
            this.clubsService.findClubTeams({clubIndex: rankingEntry.TeamClub}),
            this.division$
        ]).pipe(
            take(1),
            map(([clubEntry, teams, division]: [ClubEntry, TeamEntry[], DivisionEntry]) => ({
                    team: teams.find((team: TeamEntry) => this.isSameTeam(rankingEntry, team, clubEntry, division.DivisionId)),
                    club: clubEntry
                })
            )
        ).subscribe(({team, club}) => {
            this.tabsNavigation.navigateTo(['clubs', club.UniqueIndex, 'team', team.TeamId]);
        });

    }

    navigateToPlayer(uniqueIndex: number) {
        this.division$.pipe(
            take(1),
        ).subscribe((division: DivisionEntry) => {
            this.tabsNavigation.navigateTo(['player', uniqueIndex.toString(10)], {
                state: {preferredPlayerCategory: division.DivisionCategory}
            });
        });

    }

    toggleFavorite() {
        this.division$.pipe(
            take(1),
            switchMap((division: DivisionEntry) => this.store.dispatch(new ToggleDivisionFromFavorites(
                {
                    uniqueIndex: division.DivisionId,
                    uri: ['divisions', division.DivisionId.toString(10)],
                    label: division.DivisionName
                }
            )))
        ).subscribe();
    }

    addToCalendar() {
        this.matches$
            .pipe(take(1))
            .subscribe((matches) => this.calendarService.checkPremiumAndAddTeamMatchEntries(matches, {
                dialogHeaderTranslationKey: 'CALENDAR.ADD_TO_CALENDAR',
                dialogMessageTranslationKey: 'CALENDAR.ADD_ALL_DIVISION_MATCHES'
            }, this.ionRouter.nativeEl));
    }
}
