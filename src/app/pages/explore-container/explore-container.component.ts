import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {PLAYER_CATEGORY} from '../../core/models/user';
import {Observable, ReplaySubject} from 'rxjs';
import {MemberEntry} from '../../core/api/models/member-entry';
import {UserState} from '../../core/store/user/user.state';
import {shareReplay, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {IonRouterOutlet, LoadingController, ModalController} from '@ionic/angular';
import {TeamMatchesEntry} from '../../core/api/models/team-matches-entry';
import {SettingsPage} from '../settings/containers/settings-page/settings.page';
import {ModalBaseComponent} from '../modals/modal-base/modal-base.component';
import {TranslateService} from '@ngx-translate/core';
import {AfttLoginPage} from '../modals/aftt-login/aftt-login-page.component';
import {MembersService} from '../../core/api/services/members.service';
import {ClubsService} from '../../core/api/services/clubs.service';
import {UpdateMemberEntries} from '../../core/store/user/user.actions';
import {TabTState} from '../../core/store/user/tab-t-state.service';
import {ChooseMainMemberClubComponent} from '../modals/choose-main-member-club/choose-main-member-club.component';
import {WeeklyElo} from '../../core/api/models/weekly-elo';
import {SettingsState} from '../../core/store/settings';
import {TABT_DATABASES} from '../../core/interceptors/tabt-database-interceptor.service';
import {HapticsService} from '../../core/services/haptics.service';
import {ImpactStyle} from '@capacitor/haptics';
import {AnalyticsService} from '../../core/services/firebase/analytics.service';
import {OnDestroyHook} from '../../core/on-destroy-hook';
import {DialogService} from '../../shared/services/dialog-service.service';
import {WeeklyNumericRanking} from '../../core/api/models/weekly-numeric-ranking';

@Component({
    selector: 'beping-explore-container',
    templateUrl: './explore-container.component.html',
    styleUrls: ['./explore-container.component.scss']
})
export class ExploreContainerComponent extends OnDestroyHook implements OnInit {

    categoriesAvailable$: Observable<PLAYER_CATEGORY[]>;
    currentCategory$: ReplaySubject<PLAYER_CATEGORY> = new ReplaySubject<PLAYER_CATEGORY>(1);
    currentMemberEntry$: Observable<MemberEntry>;
    latestMatches$: Observable<TeamMatchesEntry[]>;

    @Select(TabTState.isLoggedIn) isLoggedIn$: Observable<boolean>;
    @Select(UserState.numericRankings) numericRankings$: Observable<WeeklyNumericRanking[]>;
    @Select(UserState.isLoading) isLoading$: Observable<boolean>;
    @Select(SettingsState.getCurrentDatabase) database: Observable<TABT_DATABASES>;
    TABT_DATABASES = TABT_DATABASES;

    constructor(
        private store: Store,
        private readonly dialogService: DialogService,
        private readonly modalCtrl: ModalController,
        private readonly ionRouter: IonRouterOutlet,
        private readonly translateService: TranslateService,
        private readonly membersService: MembersService,
        private readonly clubService: ClubsService,
        private readonly loaderCtrl: LoadingController,
        private readonly ionRouterOutlet: IonRouterOutlet,
        private readonly hapticsService: HapticsService,
        private readonly analyticsService: AnalyticsService
    ) {
        super();
        this.categoriesAvailable$ = this.store.select(UserState.availablePlayerCategories).pipe(shareReplay(1));

        this.store.select(UserState.getMainPlayerCategory).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((category) => this.currentCategory$.next(category));

        this.currentMemberEntry$ = this.currentCategory$.pipe(
            switchMap((category: PLAYER_CATEGORY) => this.store.select(UserState.getMemberEntryForCategory(category))),
            tap((a) => console.log(a)),
            shareReplay(1)
        );
        this.latestMatches$ = this.currentCategory$.pipe(
            switchMap((category: PLAYER_CATEGORY) => this.store.select(UserState.getLatestMatchesForCategory(category))),
            shareReplay(1)
        );
    }

    ngOnInit() {
    }

    async categoryClicked(category: PLAYER_CATEGORY) {
        this.analyticsService.logEvent('member_category_changed');
        this.hapticsService.hapticsImpact(ImpactStyle.Medium);
        this.currentCategory$.next(category);
        const catTranslation = this.translateService.instant('PLAYER_CATEGORY.' + category);
        const catChangedTranslation = this.translateService.instant('DASHBOARD.PLAYER_CATEGORY_CHANGED', {category: catTranslation});
        this.dialogService.showToast({
            message: catChangedTranslation,
            position: 'top',
            color: 'primary',
            duration: 3000
        });
    }

    getIcon(category: PLAYER_CATEGORY) {
        switch (category) {
            case PLAYER_CATEGORY.MEN:
            case PLAYER_CATEGORY.VETERANS:
            case PLAYER_CATEGORY.YOUTH:
                return 'male-outline';
            case PLAYER_CATEGORY.WOMEN:
            case PLAYER_CATEGORY.VETERANS_WOMEN:
                return 'female-outline';
        }
    }

    async openSettings() {
        this.analyticsService.logEvent('open_settings');

        this.dialogService.showModal({
            component: ModalBaseComponent,
            swipeToClose: true,
            componentProps: {
                rootPage: SettingsPage
            },
            presentingElement: this.ionRouter.nativeEl
        });
    }

    async loginWithAFTT() {
        this.analyticsService.logEvent('login_cta');

        const modal = await this.dialogService.showModal({
            component: AfttLoginPage,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl,
            componentProps: {}
        });

        const result = await modal.onWillDismiss();
        if (result?.data?.logged) {
            await this.dialogService.showToast({
                message: 'Votre classement arrivera sous peu',
                position: 'top',
                color: 'success',
                duration: 5000
            });
        }
    }

    async chooseMainMember() {
        this.analyticsService.logEvent('open_choose_main_member');

        await this.dialogService.showModal({
            component: ModalBaseComponent,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl,
            componentProps: {
                rootPage: ChooseMainMemberClubComponent
            }
        });
    }

    refresh(event: CustomEvent) {
        this.analyticsService.logEvent('refresh_dashboard');

        event.detail.complete();
        this.currentMemberEntry$.pipe(
            take(1),
            switchMap((member) => this.store.dispatch(new UpdateMemberEntries(member.UniqueIndex)))
        ).subscribe();
    }
}
