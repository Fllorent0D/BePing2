import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MemberEntry} from '../../../core/api/models/member-entry';
import {MembersService} from '../../../core/api/services/members.service';
import {catchError, debounceTime, mergeMap, tap} from 'rxjs/operators';
import {DialogService} from '../../../shared/services/dialog-service.service';
import {PLAYER_CATEGORY} from '../../../core/models/user';
import {RankingMethodName, RankingService} from '../../../core/services/tabt/ranking.service';
import {ModalController} from '@ionic/angular';
import {Components} from '@ionic/core';
import IonSearchbar = Components.IonSearchbar;

@Component({
    selector: 'beping-search-player',
    templateUrl: './search-member.component.html',
    styleUrls: ['./search-member.component.css']
})
export class SearchMemberComponent implements OnInit, AfterViewInit {
    @Input() showNumericRanking = false;
    @Input() memberCategory: PLAYER_CATEGORY | undefined;

    @ViewChild('searchbar') searchBar: IonSearchbar;

    searchBox: FormControl;
    members$: Observable<MemberEntry[]>;
    loading = false;
    skeletonRows: number[];

    constructor(
        private readonly membersService: MembersService,
        private readonly dialogService: DialogService,
        private readonly rankingService: RankingService,
        private readonly modalCtrl: ModalController
    ) {
    }

    ngOnInit(): void {
        this.skeletonRows = [...Array(16).keys()].map(() => Math.floor(Math.random() * 40) + 30);

        this.searchBox = new FormControl('');
        this.members$ = this.searchBox.valueChanges.pipe(
            debounceTime(500),
            tap(() => this.loading = true),
            mergeMap((searchTerms: string) => {
                if (searchTerms === '') {
                    return of([]);
                }

                return this.membersService.findAllMembers({
                    nameSearch: searchTerms,
                    rankingPointsInformation: this.showNumericRanking,
                    playerCategory: this.memberCategory
                });
            }),
            tap(() => this.loading = false),
            catchError(() => of([])),
        );
    }

    belRanking(member: MemberEntry): number {
        return this.rankingService.getPoints(member.RankingPointsEntries, RankingMethodName.BEL_POINTS);
    }

    async closeModal() {
        await this.modalCtrl.dismiss();
    }

    async playerClicked(member: MemberEntry) {
        await this.modalCtrl.dismiss({member});
    }

    ngAfterViewInit(): void {
        this.searchBar.setFocus();
    }
}
