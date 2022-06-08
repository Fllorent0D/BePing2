import {Component, OnDestroy, OnInit} from '@angular/core';
import {IonNav, ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {UserState, UserStateModel} from '../../../../core/store/user/user.state';
import {SeasonState} from '../../../../core/store/season';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {TabTState, TabTStateModel} from '../../../../core/store/user/tab-t-state.service';
import {Logout} from '../../../../core/store/user/aftt.actions';
import {finalize, map, switchMap} from 'rxjs/operators';
import {AfttLoginPage} from '../../../modals/aftt-login/aftt-login-page.component';
import {UntypedFormControl} from '@angular/forms';
import {UpdateMainCategory} from '../../../../core/store/user/user.actions';
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

@Component({
    selector: 'beping-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy {

    playerName$: Observable<string>;
    playerCategories$: Observable<PLAYER_CATEGORY[]>;
    season$: Observable<SeasonEntry>;
    isLoggedIn: Observable<boolean>;
    account$: Observable<string>;
    mainCategory$: Observable<PLAYER_CATEGORY>;
    currentLang$: Observable<LANG>;
    currentTheme$: Observable<THEME>;
    userState$: Observable<UserStateModel>;

    @Select(InAppPurchasesState.isPro) isPro$: Observable<boolean>;
    @Select(SettingsState.displayELO) displayELO$: Observable<boolean>;
    @Select(SettingsState.displayNumericRanking) displayNumeric$: Observable<boolean>;
    @Select(RemoteSettingsState.bepingProEnabled) bepingProEnabled$: Observable<boolean>;

    version: string;
    build: string;
    isOnline: boolean;

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly store: Store,
        private readonly ionNav: IonNav,
        private readonly translate: TranslateService,
        private readonly internalIdService: InternalIdentifiersService,
        private readonly browser: InAppBrowserService,
        private readonly analyticsService: AnalyticsService,
        private readonly dialogService: DialogService,
    ) {
    }

    ngOnInit() {
        this.playerName$ = this.store.select(UserState.getPlayerName);
        this.userState$ = this.store.select(UserState);
        this.playerCategories$ = this.store.select(UserState.availablePlayerCategories);
        this.season$ = this.store.select(SeasonState.getCurrentSeason);
        this.isLoggedIn = this.store.select(TabTState.isLoggedIn);
        this.mainCategory$ = this.store.select(UserState.getMainPlayerCategory);
        this.account$ = this.store.select(TabTState).pipe(map((aftt: TabTStateModel) => aftt.account));
        this.currentLang$ = this.store.select(SettingsState.getCurrentLang);
        this.currentTheme$ = this.store.select(SettingsState.getCurrentTheme);
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
        this.ionNav.push(ChooseMainMemberClubComponent);
        /*
        const modal = await this.modalCtrl.create({
            component: ModalBaseComponent,
            swipeToClose: true,
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
        this.analyticsService.logEvent('settings-change-lang');

        this.store.dispatch(new UpdateCurrentLang(event.detail.value));
    }

    changeTheme(event: CustomEvent) {
        this.store.dispatch(new SetTheme(event.detail.value));
    }

    register() {
        this.analyticsService.logEvent('register');
        const user: UserStateModel = this.store.selectSnapshot(UserState);

        if (user.memberUniqueIndex) {
            this.browser.openRegister(user.memberUniqueIndex, user.club.UniqueIndex);
        } else {
            this.browser.openRegister();
        }
    }

    async resetCache() {
        this.analyticsService.logEvent('settings-reset-cache');

        const loader = await this.dialogService.showLoading({
            message: this.translate.instant('SETUP.LOADING'),
            backdropDismiss: false
        });
        this.store.dispatch([
            new Reset(DivisionsState),
            new Reset(ClubsState)
        ]).pipe(
            switchMap(() => this.store.dispatch([
                new GetDivisions(),
                new GetClubs()
            ])),
            finalize(() => loader.dismiss())
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
}
