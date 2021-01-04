import {Component, Input, OnInit} from '@angular/core';
import {MemberEntry} from '../../../core/api/models/member-entry';
import {ModalController} from '@ionic/angular';
import {ClubEntry} from '../../../core/api/models/club-entry';
import {ClubsService} from '../../../core/api/services/clubs.service';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
    selector: 'beping-choose-player',
    templateUrl: './choose-player.page.html',
    styleUrls: ['./choose-player.page.scss']
})
export class ChoosePlayerPage implements OnInit {

    @Input() title: string;
    @Input() club: ClubEntry;

    members$: Observable<MemberEntry[]>;
    skeletonRows: Array<number>;

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly clubsService: ClubsService
    ) {
    }

    ngOnInit() {
        this.skeletonRows = [...Array(16).keys()].map(() => Math.floor(Math.random() * 40) + 30);
        this.members$ = this.clubsService.findClubMembers({clubIndex: this.club.UniqueIndex}).pipe(delay(400));
    }

    async closeModal(): Promise<void> {
        await this.modalCtrl.dismiss();
    }

    async memberClicked(member: MemberEntry) {
        await this.modalCtrl.dismiss({
            member
        });
    }

}
