import {Component, OnInit} from '@angular/core';
import {IonRouterOutlet, LoadingController, NavController} from '@ionic/angular';
import {ChooseClubPage} from '../../pages/modals/choose-club/choose-club.page';
import {Select, Store} from '@ngxs/store';
import {ClubsState} from '../../core/store/clubs';
import {combineLatest, Observable} from 'rxjs';
import {ClubEntry} from '../../core/api/models/club-entry';
import {finalize, map, switchMap} from 'rxjs/operators';
import {DivisionsState} from '../../core/store/divisions';
import {SeasonState} from '../../core/store/season';
import {ChoosePlayerPage} from '../../pages/modals/choose-player/choose-player.page';
import {MemberEntry} from '../../core/api/models/member-entry';
import {Router} from '@angular/router';
import {HasSeenOnBoarding, SetUser} from '../../core/store/user/user.actions';
import {AfttLoginPage} from '../../pages/modals/aftt-login/aftt-login-page.component';
import {MembersService} from '../../core/api/services/members.service';
import {ClubsService} from '../../core/api/services/clubs.service';
import {DialogService} from '../../shared/services/dialog-service.service';

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
        private readonly dialogService: DialogService,
        private readonly ionRouterOutlet: IonRouterOutlet,
        private readonly navCtrl: NavController,
        private readonly store: Store,
        private readonly router: Router,
        private readonly membersService: MembersService,
        private readonly clubService: ClubsService,
        private readonly loaderCtrl: LoadingController
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
        const modal = await this.dialogService.showModal({
            component: ChooseClubPage,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl
        });
        const result = await modal.onWillDismiss();
        if (result?.data?.club) {
            this.selectedClub = result.data.club;
            this.selectedMember = null;
        }

    }

    async choosePlayer() {
        const modal = await this.dialogService.showModal({
            component: ChoosePlayerPage,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl,
            componentProps: {
                title: 'Qui êtes-vous?',
                club: this.selectedClub
            }
        });

        const result = await modal.onWillDismiss();
        if (result?.data?.member) {
            this.selectedMember = result.data.member;
        }

    }

    startBePing() {
        this.store.dispatch([
            new HasSeenOnBoarding(),
            ...((!!this.selectedMember && !!this.selectedClub) ? [new SetUser(this.selectedMember.UniqueIndex, this.selectedClub)] : [])
        ]).subscribe(() => {
            this.navCtrl.setDirection('root', true, 'forward');
            this.router.navigate(['tabs']);
        });
    }

    async loginWithAFTT() {
        const modal = await this.dialogService.showModal({
            component: AfttLoginPage,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl,
            componentProps: {}
        });

        const result = await modal.onWillDismiss();
        if (result?.data?.logged) {
            const loader = await this.loaderCtrl.create({
                message: 'Recherche en cours...'
            });
            loader.present();

            this.membersService.findAllMembers({
                nameSearch: ' ',
                rankingPointsInformation: true
            }).pipe(
                map((members: MemberEntry[]) => members.filter((member) => member.RankingPointsEntries?.length > 1)),
                map((members) => {
                    if (members.length === 1) {
                        return members[0];
                    }
                    throw new Error('Player not found');
                }),
                switchMap((member: MemberEntry) =>
                    this.clubService.findClubById({clubIndex: member?.Club}).pipe(
                        map((club) => ({club, member}))
                    )
                ),
                finalize(() => loader.dismiss())
            ).subscribe(({club, member}) => {
                this.selectedMember = member;
                this.selectedClub = club;
                this.startBePing();
            });
        }
    }
}
