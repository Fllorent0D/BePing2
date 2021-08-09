import {Component, Input, OnInit} from '@angular/core';
import {IonNav, ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserState, UserStateModel} from '../../../../core/store/user/user.state';
import {SeasonState} from '../../../../core/store/season';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {TabTState, TabTStateModel} from '../../../../core/store/user/tab-t-state.service';
import {Logout} from '../../../../core/store/user/aftt.actions';
import {map, switchMap, take} from 'rxjs/operators';
import {AfttLoginPage} from '../aftt-login/aftt-login-page.component';
import {FormControl} from '@angular/forms';
import {UpdateMainCategory} from '../../../../core/store/user/user.actions';
import {TranslateService} from '@ngx-translate/core';
import {LANG} from '../../../../core/models/langs';
import {SetTheme, SettingsState, THEME, UpdateCurrentLang} from '../../../../core/store/settings';
import {InAppBrowserService} from '../../../../core/services/browser/in-app-browser.service';
import {InternalIdentifiersService} from '../../../../core/api/services/internal-identifiers.service';
import {SeasonEntry} from '../../../../core/api/models/season-entry';

@Component({
    selector: 'beping-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

    @Input() isModal = false;

    playerName$: Observable<string>;
    playerCategories$: Observable<PLAYER_CATEGORY[]>;
    season$: Observable<SeasonEntry>;
    isLoggedIn: Observable<boolean>;
    account$: Observable<string>;
    mainCategory$: Observable<PLAYER_CATEGORY>;
    currentLang$: Observable<LANG>;
    currentTheme$: Observable<THEME>;
    mainPlayerCategory: FormControl;
    userState$: Observable<UserStateModel>;

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly store: Store,
        private readonly ionNav: IonNav,
        private readonly translate: TranslateService,
        private readonly internalIdService: InternalIdentifiersService,
        private readonly browser: InAppBrowserService
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
        console.log(this.translate.currentLang);
    }

    async closeModal() {
        console.log(this.modalCtrl);
        await this.modalCtrl.dismiss();
    }

    login() {
        this.ionNav.push(AfttLoginPage);
    }

    logout() {
        this.store.dispatch(new Logout());
    }

    mainCategoryChanged(event: CustomEvent) {
        this.store.dispatch(new UpdateMainCategory(event.detail.value));
    }

    changeLang(event: CustomEvent) {
        this.store.dispatch(new UpdateCurrentLang(event.detail.value));
    }

    changeTheme(event: CustomEvent) {
        this.store.dispatch(new SetTheme(event.detail.value));
    }

    register() {
        this.userState$.pipe(
            take(1),
            switchMap((userState: UserStateModel) => this.internalIdService.getRegisterLink({
                clubUniqueIndex: userState.club.UniqueIndex,
                playerUniqueIndex: userState.memberUniqueIndex
            }))
        ).subscribe(({url}) => {
            this.browser.openInAppBrowser(url);
            console.log(url);
        });
    }
}
