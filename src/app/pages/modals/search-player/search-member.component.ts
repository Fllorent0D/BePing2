import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {firstValueFrom, Observable, of} from 'rxjs';
import {MemberEntry} from '../../../core/api/models/member-entry';
import {MembersService} from '../../../core/api/services/members.service';
import {catchError, debounceTime, filter, switchMap, tap} from 'rxjs/operators';
import {DialogService} from '../../../core/services/dialog-service.service';
import {PLAYER_CATEGORY} from '../../../core/models/user';
import {RankingMethodName, RankingService} from '../../../core/services/tabt/ranking.service';
import {ModalController} from '@ionic/angular';
import {AnalyticsService} from '../../../core/services/firebase/analytics.service';
import {Store} from '@ngxs/store';
import {Keyboard} from '@capacitor/keyboard';
import {RemoteSettingsState} from '../../../core/store/remote-settings';

@Component({
    selector: 'beping-search-player',
    templateUrl: './search-member.component.html',
    styleUrls: ['./search-member.component.css']
})
export class SearchMemberComponent implements OnInit, AfterViewInit {
    @Input() showNumericRanking = false;
    @Input() memberCategory: PLAYER_CATEGORY | undefined;

    @ViewChild('searchbar') searchBar: any;

    searchBox: FormControl<string>;
    members$: Observable<MemberEntry[]>;
    loading = false;

    constructor(
        private readonly membersService: MembersService,
        private readonly dialogService: DialogService,
        private readonly rankingService: RankingService,
        private readonly modalCtrl: ModalController,
        private readonly analyticsService: AnalyticsService,
        private readonly store: Store
    ) {
    }

    ngOnInit(): void {
        this.searchBox = new FormControl<string>('');
        this.members$ = this.searchBox.valueChanges.pipe(
            filter((text) => text?.length >= 3 || text.length === 0),
            debounceTime(500),
            tap(() => this.loading = true),
            switchMap((searchTerms: string) => {
                if (searchTerms === '') {
                    return of([]);
                }
                this.analyticsService.logEvent('search_member', {searchTerms});
                const useLookup = false;
                if (useLookup) {
                    return this.membersService.findAllMembersLookup({
                        query: searchTerms,
                    }).pipe(
                        catchError(() => of([]))
                    );
                }

                return this.membersService.findAllMembers({nameSearch: searchTerms}).pipe(
                    catchError(() => of([]))
                );
            }),
            tap(() => this.loading = false),
            catchError(() => of([])),
        );
    }

    belRanking(member: MemberEntry): number {
        return this.rankingService.getPoints(member.RankingPointsEntries, RankingMethodName.BEL_POINTS);
    }

    async closeModal() {
        this.analyticsService.logEvent('search_member_dismiss');
        await this.modalCtrl.dismiss();
    }

    async playerClicked(member: MemberEntry) {
        this.analyticsService.logEvent('search_member_select');
        try {
            const memberFromCat = await firstValueFrom(this.membersService.findMemberById({
                uniqueIndex: member.UniqueIndex,
                playerCategory: this.memberCategory,
                rankingPointsInformation: true
            }));
            await this.modalCtrl.dismiss({member: memberFromCat});
        } catch (e) {
            await this.dialogService.showErrorAlert({message: 'Something went wrong when downloading player profile. Please retry'});
        }

    }

    ngAfterViewInit(): void {
        this.searchBar.el.setFocus();
        setTimeout(() => {
            this.searchBar.el.setFocus();
        }, 10);
    }

    hideKeyboard() {
        Keyboard.hide();
    }
}
