import {Component, OnInit} from '@angular/core';
import {ChooseClubPage} from '../choose-club/choose-club.page';
import {ChoosePlayerPage} from '../choose-player/choose-player.page';
import {ModalController, NavController} from '@ionic/angular';
import {Store} from '@ngxs/store';
import {ClubEntry} from '../../../core/api/models/club-entry';
import {MemberEntry} from '../../../core/api/models/member-entry';
import {SetUser} from '../../../core/store/user/user.actions';
import {finalize, tap} from 'rxjs/operators';

@Component({
    selector: 'beping-choose-main-member-club',
    templateUrl: './choose-main-member-club.component.html',
    styleUrls: ['./choose-main-member-club.component.scss']
})
export class ChooseMainMemberClubComponent implements OnInit {

    selectedClub: ClubEntry | null;
    selectedMember: MemberEntry | null;
    isLoading = false;

    constructor(
        public readonly modalCtrl: ModalController,
        private readonly navCtrl: NavController,
        private readonly store: Store
    ) {
    }

    ngOnInit() {
        console.log('init');
    }

    async chooseClub() {
        const modal = await this.modalCtrl.create({
            component: ChooseClubPage,
            canDismiss: true,
            presentingElement: await this.modalCtrl.getTop()
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
            canDismiss: true,
            presentingElement: await this.modalCtrl.getTop(),
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

    select() {
        if (!!this.selectedMember && !!this.selectedClub) {
            this.isLoading = true;
            this.store.dispatch(
                new SetUser(this.selectedMember.UniqueIndex, this.selectedClub)
            ).pipe(
                tap(() => this.closeModal()),
                finalize(() => this.isLoading = false)
            ).subscribe();
        }

    }


    async closeModal() {
        await this.modalCtrl.dismiss();
    }
}
