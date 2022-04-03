import {Component, OnInit} from '@angular/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {Head2HeadService} from '../../../../core/api/services/head-2-head.service';
import {Store} from '@ngxs/store';
import {UserState} from '../../../../core/store/user/user.state';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {Head2HeadData} from '../../../../core/api/models/head-2-head-data';
import {MatchEntryHistory} from '../../../../core/api/models/match-entry-history';
import {groupBy} from '../../../../core/utils/group-by';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';

@Component({
    selector: 'beping-face-to-face',
    templateUrl: './face-to-face.component.html',
    styleUrls: ['./face-to-face.component.css']
})
export class FaceToFaceComponent implements OnInit {
    memberUniqueIndex$: Observable<number>;
    opponentUniqueIndex$: Observable<number>;
    head2headResults$: Observable<Head2HeadData>;
    matchesPerSeason$: Observable<MatchEntryHistory[][]>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly head2HeadService: Head2HeadService,
        private readonly tabNavigator: TabsNavigationService,
        private readonly store: Store
    ) {
    }

    ngOnInit(): void {
        this.opponentUniqueIndex$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => Number(params.get('id')))
        );
        this.memberUniqueIndex$ = this.store.select(UserState.getMainPlayerCategory).pipe(
            switchMap((cat) => this.store.select(UserState.getMemberEntryForCategory(cat))),
            map((memeberEntry: MemberEntry) => memeberEntry.UniqueIndex)
        );

        this.head2headResults$ = combineLatest([
            this.memberUniqueIndex$, this.opponentUniqueIndex$
        ]).pipe(
            switchMap(([uniqueIndex, opponentUniqueIndex]) => this.head2HeadService.findHead2HeadMatches({
                playerUniqueIndex: uniqueIndex,
                opponentUniqueIndex
            }))
        );

        this.matchesPerSeason$ = this.head2headResults$.pipe(
            filter((head2head: Head2HeadData) => head2head.matchEntryHistory.length > 0),
            map((head2head: Head2HeadData) => head2head.matchEntryHistory),
            map((matches: MatchEntryHistory[]) => groupBy(matches, 'season')),
            tap((t) => console.log(t))
        );
    }

    goToMatchSheet(matchUniqueIndex: string) {
        this.tabNavigator.navigateTo(['team-match-details', matchUniqueIndex]);
    }
}
