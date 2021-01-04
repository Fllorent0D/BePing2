import {Component, OnInit} from '@angular/core';
import {IonRouterOutlet, ModalController, NavController} from '@ionic/angular';
import {ChooseClubPage} from '../../pages/modals/choose-club/choose-club.page';
import {Select, Store} from '@ngxs/store';
import {ClubsState} from '../../core/store/clubs';
import {combineLatest, Observable} from 'rxjs';
import {ClubEntry} from '../../core/api/models/club-entry';
import {map, take} from 'rxjs/operators';
import {DivisionsState} from '../../core/store/divisions';
import {DivisionEntry} from '../../core/api/models/division-entry';
import {SeasonState} from '../../core/store/season';
import {ChoosePlayerPage} from '../../pages/modals/choose-player/choose-player.page';
import {MemberEntry} from '../../core/api/models/member-entry';
import {ClubsService} from '../../core/api/services/clubs.service';
import {Router} from '@angular/router';
import {HasSeenOnBoarding, SetUser} from '../../core/store/user/user.actions';

@Component({
    selector: 'beping-login-page',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

    @Select(ClubsState.loading) clubsLoading$: Observable<boolean>;
    @Select(ClubsState.error) clubsError$: Observable<Error | null>;

    @Select(DivisionsState.error) divisionsError$: Observable<Error | null>;
    @Select(DivisionsState.loading) divisionsLoading$: Observable<boolean>;

    @Select(SeasonState.loading) seasonLoading$: Observable<boolean>;
    @Select(DivisionsState.error) seasonError$: Observable<Error | null>;


    isLoading$: Observable<boolean>;
    hasError$: Observable<boolean>;

    isSynchronized$: Observable<boolean>;

    selectedClub: ClubEntry | null;
    selectedMember: MemberEntry | null;

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly ionRouterOutlet: IonRouterOutlet,
        private readonly navCtrl: NavController,
        private readonly store: Store,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.isLoading$ = combineLatest([
            this.clubsLoading$,
            this.divisionsLoading$,
            this.seasonLoading$
        ]).pipe(
            map(([clubLoading, divisionsLoading, seasonLoading]) => {
                return clubLoading && divisionsLoading && seasonLoading;
            })
        );
        this.hasError$ = combineLatest([
            this.clubsError$,
            this.divisionsError$,
            this.seasonError$
        ]).pipe(
            map(([clubError, divisionError, seasonError]) => {
                return !!clubError || !!divisionError || !!seasonError;
            })
        );

        this.isSynchronized$ = combineLatest([
            this.isLoading$, this.hasError$
        ]).pipe(
            map(([isLoading, hasError]) => isLoading && !hasError)
        );

    }

    async chooseClub() {
        const modal = await this.modalCtrl.create({
            component: ChooseClubPage,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl
        });
        await modal.present();

        const result = await modal.onWillDismiss();
        if (result?.data?.club) {
            this.selectedClub = result.data.club;
            this.selectedMember = null;
        }

    }

    async choosePlayer() {
        const modal = await this.modalCtrl.create({
            component: ChoosePlayerPage,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl,
            componentProps: {
                title: 'Qui êtes-vous?',
                club: this.selectedClub
            }
        });
        await modal.present();

        const result = await modal.onWillDismiss();
        if (result?.data?.member) {
            this.selectedMember = result.data.member;
        }

    }

    startBePing() {
        this.store.dispatch([
            new HasSeenOnBoarding(),
            new SetUser(this.selectedMember.UniqueIndex, this.selectedClub)
        ]).subscribe(() => {
            this.navCtrl.setDirection('root', true, 'forward');
            this.router.navigate(['tabs']);
        });
    }

}
