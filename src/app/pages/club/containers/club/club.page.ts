import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {map, switchMap, take} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {ClubMembersListService} from '../../../../core/services/tabt/club-members-list.service';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {VenueEntry} from '../../../../core/api/models/venue-entry';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {add, sub} from 'date-fns';
import {FavoriteItem, FavoritesState, ToggleClubFromFavorites} from '../../../../core/store/favorites';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {ImpactStyle} from '@capacitor/haptics';
import {HapticsService} from '../../../../core/services/haptics.service';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';
import {CalendarService} from '../../../../core/services/calendar/calendar.service';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {TranslateService} from '@ngx-translate/core';
import {RemoteSettingsState} from '../../../../core/store/remote-settings';
import {IonRouterOutlet, ViewDidEnter} from '@ionic/angular';
import SwiperCore from 'swiper';
import Swiper, {Scrollbar, SwiperOptions} from 'swiper';
import {SwiperComponent} from 'swiper/angular';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ShareService} from '../../../../core/services/share.service';
import {firstValueFrom} from 'rxjs';


@UntilDestroy()
@Component({
    selector: 'beping-club',
    templateUrl: './club.page.html',
    styleUrls: ['./club.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubPage implements OnInit, ViewDidEnter {
    swiperConfig: SwiperOptions = {
        speed: 150,
        effect: 'cube',
        autoHeight: true
    };
    activeSwiperIndex = 0;


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
    @Select(RemoteSettingsState.bepingProEnabled) bepingProEnabled$: Observable<boolean>;
    @ViewChild('swiper', {static: false}) swiper?: SwiperComponent;

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
        private readonly analyticsService: AnalyticsService,
        private readonly calendarService: CalendarService,
        private readonly dialogService: DialogService,
        private readonly translate: TranslateService,
        private readonly ionRouter: IonRouterOutlet,
        protected readonly ngZone: NgZone,
        private readonly shareService: ShareService
    ) {
        this.from$ = new BehaviorSubject<Date>(sub(new Date(), {weeks: 2}));
        this.to$ = new BehaviorSubject<Date>(new Date());
    }

    ionViewDidEnter(): void {
        setTimeout(() => {
            this.swiper.swiperRef.updateAutoHeight(0);
        }, 1000);
    }

    slideChange([swiper]: [Swiper]) {
        this.ngZone.run(() => this.activeSwiperIndex = swiper.activeIndex);
    }

    selectTab(index) {
        this.swiper.swiperRef.slideTo(index);
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

        this.matches$ = this.club$.pipe(
            switchMap((club) => this.matchesService.findAllMatches({club: club.UniqueIndex})),
        );

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

        combineLatest([
            this.matches$,
            this.club$,
            this.teams$,
            this.matches$
        ]).pipe(
            untilDestroyed(this)
        ).subscribe({
            next: () => this.swiper.swiperRef.updateAutoHeight(0)
        });


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
            switchMap((club: ClubEntry) => this.store.dispatch(new ToggleClubFromFavorites({
                uniqueIndex: club.UniqueIndex,
                uri: ['clubs', club.UniqueIndex],
                note: club.LongName,
                label: club.UniqueIndex
            } as FavoriteItem<string>)))
        ).subscribe();
    }

    addToCalendar() {
        this.matches$
            .pipe(take(1))
            .subscribe((matches) => this.calendarService.checkPremiumAndAddTeamMatchEntries(matches, {
                dialogHeaderTranslationKey: 'CALENDAR.ADD_TO_CALENDAR',
                dialogMessageTranslationKey: 'CALENDAR.ADD_ALL_CLUB_MATCHES'
            }, this.ionRouter.nativeEl));
    }

    share() {
        this.club$.pipe(
            take(1),
            switchMap((club) =>
                this.shareService.shareUrl(
                    '/club/' + club.UniqueIndex,
                    club.LongName,
                    this.translate.instant('SHARE.SHARE_CLUB_ON_BEPING', {club: club.LongName})
                )
            )
        ).subscribe();
    }
}

