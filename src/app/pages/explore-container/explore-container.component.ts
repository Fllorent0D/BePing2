import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {PLAYER_CATEGORY} from '../../core/models/user';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {MemberEntry} from '../../core/api/models/member-entry';
import {UserState} from '../../core/store/user/user.state';
import {map, share, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {IonRouterOutlet, ModalController, Platform, ToastController} from '@ionic/angular';
import {TeamMatchesEntry} from '../../core/api/models/team-matches-entry';
import {AdsService} from '../../core/services/firebase/ads.service';
import {ChooseClubPage} from '../modals/choose-club/choose-club.page';
import {SettingsPage} from '../settings/containers/settings-page/settings.page';
import {ModalBaseComponent} from '../modals/modal-base/modal-base.component';

@Component({
    selector: 'beping-explore-container',
    templateUrl: './explore-container.component.html',
    styleUrls: ['./explore-container.component.scss']
})
export class ExploreContainerComponent implements OnInit {

    categoriesAvailable$: Observable<PLAYER_CATEGORY[]>;
    currentCategory$: ReplaySubject<PLAYER_CATEGORY> = new ReplaySubject<PLAYER_CATEGORY>(1);
    currentMemberEntry$: Observable<MemberEntry>;
    latestMatches$: Observable<TeamMatchesEntry[]>;

    constructor(
        private store: Store,
        private toastrCtrl: ToastController,
        private adsService: AdsService,
        private readonly modalCtrl: ModalController,
        private readonly ionRouter: IonRouterOutlet,
    ) {
        this.categoriesAvailable$ = this.store.select(UserState.availablePlayerCategories).pipe(share());
        this.store.select(UserState.getMainPlayerCategory).subscribe((category) => this.currentCategory$.next(category));

        this.currentMemberEntry$ = this.currentCategory$.pipe(
            switchMap((category: PLAYER_CATEGORY) => this.store.select(UserState.getMemberEntryForCategory(category))),
            share()
        );
        this.latestMatches$ = this.currentCategory$.pipe(
            switchMap((category: PLAYER_CATEGORY) => this.store.select(UserState.getLatestMatchesForCategory(category))),
            share()
        );
    }

    ngOnInit() {

    }

    async categoryClicked(category: PLAYER_CATEGORY) {
        this.currentCategory$.next(category);
        const toast = await this.toastrCtrl.create({
            message: `Profil ${category} chargé`,
            duration: 3000
        });
        toast.present();
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
        const modal = await this.modalCtrl.create({
            component: ModalBaseComponent,
            swipeToClose: true,
            componentProps: {
                rootPage: SettingsPage,
            },
            presentingElement: this.ionRouter.nativeEl
        });
        await modal.present();
    }

    test() {

        this.adsService.interstitialAd();
    }
}
