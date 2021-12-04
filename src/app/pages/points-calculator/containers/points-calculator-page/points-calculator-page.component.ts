import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {map, switchMap, take} from 'rxjs/operators';
import {UserState} from '../../../../core/store/user/user.state';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {FormControl} from '@angular/forms';
import {PointsCalculatorEntryWithPoints, PointsCalculatorState} from '../../../../core/store/points/points-calculator-state.service';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {RankingMethodName, RankingService} from '../../../../core/services/tabt/ranking.service';
import {PointCalculatorService} from '../../services/point-calculator.service';
import {Reset} from '@ngxs-labs/entity-state';
import {OnDestroyHook} from '../../../../core/on-destroy-hook';

@Component({
    selector: 'beping-points-calculator-page',
    templateUrl: './points-calculator-page.component.html',
    styleUrls: ['./points-calculator-page.component.css']
})
export class PointsCalculatorPageComponent extends OnDestroyHook implements OnInit {
    PLAYER_CATEGORY = PLAYER_CATEGORY;

    currentCategory$: ReplaySubject<PLAYER_CATEGORY> = new ReplaySubject<PLAYER_CATEGORY>(1);

    playerCategorySelectedFormControl: FormControl;
    currentMemberEntry$: Observable<MemberEntry>;
    playerCategories$: Observable<PLAYER_CATEGORY[]>;
    pointsEntryWithPoints$: Observable<PointsCalculatorEntryWithPoints[]>;
    nextRanking$: Observable<{ futureBelPts: number; futureRanking: string, currentBelPts: number, currentRanking: string }>;

    constructor(
        private readonly tabtNavigator: TabsNavigationService,
        private readonly rankingService: RankingService,
        private readonly pointsCalculatorService: PointCalculatorService,
        private readonly store: Store
    ) {
        super();
    }

    ngOnInit(): void {
        this.playerCategorySelectedFormControl = new FormControl();

        this.playerCategories$ = this.store.select(UserState.availablePlayerCategories).pipe(
            map((categories: PLAYER_CATEGORY[]) =>
                categories.filter(category => [PLAYER_CATEGORY.WOMEN, PLAYER_CATEGORY.MEN].includes(category))
            )
        );

        this.store.select(UserState.getMainPlayerCategory).pipe(
            take(1)
        ).subscribe((mainCategory: PLAYER_CATEGORY) => {
            switch (mainCategory) {
                case PLAYER_CATEGORY.MEN:
                case PLAYER_CATEGORY.VETERANS:
                case PLAYER_CATEGORY.YOUTH:
                    this.currentCategory$.next(PLAYER_CATEGORY.MEN);
                    break;
                case PLAYER_CATEGORY.VETERANS_WOMEN:
                case PLAYER_CATEGORY.WOMEN:
                    this.currentCategory$.next(PLAYER_CATEGORY.WOMEN);
                    break;
            }
        });

        this.currentMemberEntry$ = this.currentCategory$.pipe(
            switchMap((playerCategory: PLAYER_CATEGORY) => this.store.select(UserState.getMemberEntryForCategory(playerCategory))),
        );


        this.pointsEntryWithPoints$ = combineLatest([
            this.currentMemberEntry$,
            this.currentCategory$,
        ]).pipe(
            switchMap(([currentMemberEntry, currentCategory]) => {
                return this.store.select(PointsCalculatorState.pointsForPlayerCategory(currentCategory)).pipe(
                    map((resultsEntries) => [currentMemberEntry, resultsEntries])
                );
            }),
            map(([memberEntry, resultsEntries]: [MemberEntry, PointsCalculatorEntryWithPoints[]]) => {
                let basePoints = this.rankingService.getPoints(memberEntry.RankingPointsEntries, RankingMethodName.BEL_POINTS);
                const resultEntriesWithPoints: PointsCalculatorEntryWithPoints[] = [];
                for (const entry of resultsEntries) {
                    const pointsWon = this.pointsCalculatorService.calculatePoints(entry, basePoints);
                    basePoints = basePoints + pointsWon;
                    resultEntriesWithPoints.push({...entry, basePoints, pointsWon});
                }
                console.log(resultEntriesWithPoints);
                return resultEntriesWithPoints;
            }),
        );

        const lastPoints$ = this.pointsEntryWithPoints$.pipe(
            map((results) => results[results.length - 1])
        );

        this.nextRanking$ = combineLatest([
            lastPoints$,
            this.currentMemberEntry$
        ]).pipe(
            map(([lastPoints, memberEntry]) => {
                console.log('next ranking' + lastPoints);
                return ({
                    futureBelPts: lastPoints?.basePoints,
                    futureRanking: lastPoints?.basePoints ? this.rankingService.getEquivalentRanking(lastPoints?.basePoints, 0) : undefined,
                    currentBelPts: this.rankingService.getPoints(memberEntry.RankingPointsEntries, RankingMethodName.BEL_POINTS),
                    currentRanking: 'D2'
                });
            }));


    }

    addEntry(): void {
        this.tabtNavigator.navigateTo(['points-calculator', 'edition']);
    }

    reset() {
        this.store.dispatch(new Reset(PointsCalculatorState));
    }

    categoryChanged(event: CustomEvent) {
        this.currentCategory$.next(event.detail.value);
    }
}
