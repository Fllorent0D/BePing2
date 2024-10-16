import {Component, ElementRef, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {IonNav, ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserState, UserStateModel} from '../../../../core/store/user/user.state';
import {GetCurrentSeason, SeasonState} from '../../../../core/store/season';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {TabTState, TabTStateModel} from '../../../../core/store/user/tabt.state';
import {Logout} from '../../../../core/store/user/aftt.actions';
import {filter, finalize, map, switchMap, take} from 'rxjs/operators';
import {AfttLoginPage} from '../../../modals/aftt-login/aftt-login-page.component';
import {UpdateMainCategory, UpdateMemberEntries} from '../../../../core/store/user/user.actions';
import {TranslateService} from '@ngx-translate/core';
import {LANG} from '../../../../core/models/langs';
import {
    SetTheme,
    SettingsState,
    THEME,
    ToggleDisplayELO,
    ToggleDisplayNumericRanking,
    UpdateCurrentLang
} from '../../../../core/store/settings';
import {InAppBrowserService} from '../../../../core/services/browser/in-app-browser.service';
import {InternalIdentifiersService} from '../../../../core/api/services/internal-identifiers.service';
import {SeasonEntry} from '../../../../core/api/models/season-entry';
import {ChooseMainMemberClubComponent} from '../../../modals/choose-main-member-club/choose-main-member-club.component';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';
import {ContactComponent} from '../contact/contact.component';
import {ConditionsUsageComponent} from '../conditions-usage/conditions-usage.component';
import {PrivacyComponent} from '../privacy/privacy.component';
import {App} from '@capacitor/app';
import {DivisionsState, GetDivisions} from '../../../../core/store/divisions';
import {ClubsState, GetClubs} from '../../../../core/store/clubs';
import {Reset} from '@ngxs-labs/entity-state';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {Network} from '@capacitor/network';
import {InAppPurchaseOrder, InAppPurchaseRestore} from '../../../../core/store/in-app-purchases/in-app-purchases.actions';
import {BePingIAP} from '../../../../core/store/in-app-purchases/in-app-purchases.model';
import {InAppPurchasesState} from '../../../../core/store/in-app-purchases/in-app-purchases.state';
import {PremiumSubscriptionsComponent} from '../premium-subscriptions/premium-subscriptions.component';
import {RemoteSettingsState} from '../../../../core/store/remote-settings';
import {ContributorsComponent} from '../contributors/contributors.component';
import {AnimationController} from '@ionic/angular';
import {IsProService} from '../../../../core/services/is-pro.service';
import {SubscribeToTopic, UnsubscribeToTopic} from '../../../../core/store/notification-topics/notifications.actions';
import {NotificationsState} from '../../../../core/store/notification-topics/notifications.state';
import {Components} from '@ionic/core';
import IonToggle = Components.IonToggle;

@Component({
    selector: 'beping-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy {

    playerName$: Observable<string>;
    clubName$: Observable<string>;
    playerCategories$: Observable<PLAYER_CATEGORY[]>;
    season$: Observable<SeasonEntry>;
    isLoggedIn: Observable<boolean>;
    account$: Observable<string>;
    mainCategory$: Observable<PLAYER_CATEGORY>;
    currentLang$: Observable<LANG>;
    currentTheme$: Observable<THEME>;
    userState$: Observable<UserStateModel>;

    isPro$: Observable<boolean>;
    notificationWhenRankingUpdated$: Observable<boolean>;
    displayELO$: Observable<boolean>;
    displayNumeric$: Observable<boolean>;
    bepingProEnabled$: Observable<boolean>;
    notificationEnabled$: Observable<boolean>;

    version: string;
    build: string;
    isOnline: boolean;
    @ViewChild('refreshIcon') refreshIconElement: ElementRef;
    @ViewChild('notificationWhenRankingUpdated') notificationWhenRankingUpdatedElement: IonToggle;
    isRefreshing: boolean;

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly store: Store,
        @Optional() private readonly ionNav: IonNav,
        private readonly translate: TranslateService,
        private readonly internalIdService: InternalIdentifiersService,
        private readonly browser: InAppBrowserService,
        private readonly analyticsService: AnalyticsService,
        private readonly dialogService: DialogService,
        private readonly animationCtrl: AnimationController,
        private readonly isProService: IsProService
    ) {
    }

    ngOnInit() {
        this.bepingProEnabled$ = this.store.select(RemoteSettingsState.bepingProEnabled);
        this.notificationEnabled$ = this.store.select(RemoteSettingsState.notificationsEnabled);
        this.displayNumeric$ = this.store.select(SettingsState.displayNumericRanking);
        this.displayELO$ = this.store.select(SettingsState.displayELO);
        this.isPro$ = this.store.select(InAppPurchasesState.isPro);
        this.playerName$ = this.store.select(UserState.getPlayerName);
        this.clubName$ = this.store.select(UserState.getPlayerClubName);
        this.userState$ = this.store.select(UserState);
        this.playerCategories$ = this.store.select(UserState.availablePlayerCategories);
        this.season$ = this.store.select(SeasonState.getCurrentSeason);
        this.isLoggedIn = this.store.select(TabTState.isLoggedIn);
        this.mainCategory$ = this.store.select(UserState.getMainPlayerCategory);
        this.account$ = this.store.select(TabTState).pipe(map((aftt: TabTStateModel) => aftt.account));
        this.currentLang$ = this.store.select(SettingsState.getCurrentLang);
        this.currentTheme$ = this.store.select(SettingsState.getCurrentTheme);
        this.notificationWhenRankingUpdated$ = this.store.select(NotificationsState.isSubscribedToTopic(`ranking_updated_${this.store.selectSnapshot(UserState.getPlayerUniqueIndex)}`));
        this.getAppInfo();
        this.listenNetwork();
    }

    ngOnDestroy(): void {
        Network.removeAllListeners();
    }

    async getAppInfo() {
        const info = await App.getInfo();
        this.version = info.version;
        this.build = info.build;
    }

    async changeMember() {
        if (!this.ionNav) {

            return;
        }
        this.ionNav.push(ChooseMainMemberClubComponent);

        /*
        const modal = await this.modalCtrl.create({
            component: ModalBaseComponent,
            canDismiss: true,
            componentProps: {
                rootPage: ChooseMainMemberClubComponent
            }
        });
        await modal.present();

        await modal.onWillDismiss();
    */
    }

    async closeModal() {
        await this.modalCtrl.dismiss();
    }

    login() {
        this.ionNav.push(AfttLoginPage);
    }

    contact() {
        this.ionNav.push(ContactComponent);
    }

    cgu() {
        this.ionNav.push(ConditionsUsageComponent);
    }

    privacy() {
        this.ionNav.push(PrivacyComponent);
    }

    logout() {
        this.store.dispatch(new Logout());
    }

    mainCategoryChanged(event: CustomEvent) {
        this.store.dispatch(new UpdateMainCategory(event.detail.value));
    }

    changeLang(event: CustomEvent) {
        this.analyticsService.logEvent('settings_change_lang');

        this.store.dispatch(new UpdateCurrentLang(event.detail.value));
    }

    changeTheme(event: CustomEvent) {
        this.store.dispatch(new SetTheme(event.detail.value));
    }

    register() {
        const user: UserStateModel = this.store.selectSnapshot(UserState);

        if (user.memberUniqueIndex) {
            this.browser.openRegister(user.memberUniqueIndex, user.club.UniqueIndex);
        } else {
            this.browser.openRegister();
        }
    }

    async resetCache() {
        this.analyticsService.logEvent('settings-reset-cache');
        /*
                const loader = await this.dialogService.showLoading({
                    message: this.translate.instant('SETUP.LOADING'),
                    backdropDismiss: false
                });

         */
        this.isRefreshing = true;
        const memberId = this.store.selectSnapshot(UserState.getPlayerUniqueIndex);
        this.store.dispatch([
            new Reset(DivisionsState),
            new Reset(ClubsState),
        ]).pipe(
            switchMap(() => {
                const actions = [
                    new GetDivisions(),
                    new GetClubs(),
                    new GetCurrentSeason()
                ];
                if (memberId) {
                    actions.push(new UpdateMemberEntries(memberId, true));
                }
                return this.store.dispatch(actions);
            }),
            finalize(() => this.isRefreshing = false)
        ).subscribe(() => {
            this.dialogService.showToast({
                duration: 3000,
                color: 'success',
                message: this.translate.instant('SETTINGS.BEPING_REFRESHED')
            });
        });
    }

    private async listenNetwork() {
        const status = await Network.getStatus();
        this.isOnline = status.connected;
        Network.addListener('networkStatusChange', networkStatus => this.isOnline = networkStatus.connected);
    }


    toggleELO(event: CustomEvent) {
        this.analyticsService.logEvent('settings-toggle-elo', {checked: event.detail.checked});
        this.store.dispatch(new ToggleDisplayELO(event.detail.checked));
    }

    toggleNumericRanking(event: CustomEvent) {
        this.analyticsService.logEvent('settings-toggle-numeric-ranking', {checked: event.detail.checked});
        this.store.dispatch(new ToggleDisplayNumericRanking(event.detail.checked));
    }

    orderBePing(): void {
        this.store.dispatch(new InAppPurchaseOrder(BePingIAP.BEPING_PRO_LOW_PRICE));
    }

    restore() {
        this.store.dispatch(new InAppPurchaseRestore());
    }

    openSubscription() {
        this.ionNav.push(PremiumSubscriptionsComponent);
    }

    openStatus() {
        this.browser.openBePingStatus();
    }

    contributors() {
        this.ionNav.push(ContributorsComponent);
    }

    openRotatio() {
        this.browser.openRotatio();
    }

    openTTManager() {
        this.browser.openTTManager();
    }

    toggleNotificationWhenRankingUpdated(event: CustomEvent) {
        event.stopPropagation();
        this.isProService.isPro$().pipe(
            take(1),
            filter((isPro) => {
                if(!isPro) {
                    // cancel the event
                    this.notificationWhenRankingUpdatedElement.checked = false;
                    this.store.dispatch(new UnsubscribeToTopic(`ranking_updated_${this.store.selectSnapshot(UserState.getPlayerUniqueIndex)}`));
                }
                return isPro;
            }),
            switchMap(() => this.userState$)
        ).subscribe((userStateModel: UserStateModel) => {
            if (event.detail.checked) {
                this.store.dispatch(new SubscribeToTopic(`ranking_updated_${this.store.selectSnapshot(UserState.getPlayerUniqueIndex)}`));
            } else {
                this.store.dispatch(new UnsubscribeToTopic(`ranking_updated_${this.store.selectSnapshot(UserState.getPlayerUniqueIndex)}`));
            }
        })
    }
}
