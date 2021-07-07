import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {PLAYER_CATEGORY} from '../../core/models/user';
import {Observable, ReplaySubject} from 'rxjs';
import {MemberEntry} from '../../core/api/models/member-entry';
import {UserState} from '../../core/store/user/user.state';
import {shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {IonRouterOutlet, ModalController, ToastController} from '@ionic/angular';
import {TeamMatchesEntry} from '../../core/api/models/team-matches-entry';
import {SettingsPage} from '../settings/containers/settings-page/settings.page';
import {ModalBaseComponent} from '../modals/modal-base/modal-base.component';
import {TranslateService} from '@ngx-translate/core';

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
        private readonly modalCtrl: ModalController,
        private readonly ionRouter: IonRouterOutlet,
        private readonly translateService: TranslateService
    ) {
        this.categoriesAvailable$ = this.store.select(UserState.availablePlayerCategories).pipe(shareReplay(1));

        this.store.select(UserState.getMainPlayerCategory)
            .pipe(take(1))
            .subscribe((category) => this.currentCategory$.next(category));

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
        this.currentCategory$.next(category);
        const catTranslation = this.translateService.instant('PLAYER_CATEGORY.' + category);
        const catChangedTranslation = this.translateService.instant('DASHBOARD.PLAYER_CATEGORY_CHANGED', {category: catTranslation});
        const toast = await this.toastrCtrl.create({
            message: catChangedTranslation,
            position: 'top',
            color: 'primary',
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
                rootPage: SettingsPage
            },
            presentingElement: this.ionRouter.nativeEl
        });
        await modal.present();
    }
}
