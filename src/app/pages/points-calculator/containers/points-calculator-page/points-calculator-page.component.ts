import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {map, shareReplay, switchMap, takeUntil} from 'rxjs/operators';
import {UserState} from '../../../../core/store/user/user.state';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {FormControl, UntypedFormControl} from '@angular/forms';
import {PointsCalculatorEntryWithPoints, PointsCalculatorState} from '../../../../core/store/points/points-calculator-state.service';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {RankingMethodName, RankingService} from '../../../../core/services/tabt/ranking.service';
import {PointCalculatorService} from '../../services/point-calculator.service';
import {Remove, Reset} from '@ngxs-labs/entity-state';
import {OnDestroyHook} from '../../../../core/on-destroy-hook';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {ActionSheetController, IonRouterOutlet} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {pivotRankingEquivalenceMen, pivotRankingEquivalenceWomen} from '../../../../core/models/bel-ranking';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';
import {IndividualMatchPointsEditorComponent} from '../individual-match-points-editor/individual-match-points-editor.component';

@Component({
    selector: 'beping-points-calculator-page',
    templateUrl: './points-calculator-page.component.html',
    styleUrls: ['./points-calculator-page.component.css']
})
export class PointsCalculatorPageComponent extends OnDestroyHook implements OnInit {
    PLAYER_CATEGORY = PLAYER_CATEGORY;

    currentCategory$: ReplaySubject<PLAYER_CATEGORY> = new ReplaySubject<PLAYER_CATEGORY>(1);
    pivot$: Observable<number>;
    currentMemberEntry$: Observable<MemberEntry>;
    playerCategories$: Observable<PLAYER_CATEGORY[]>;
    pointsEntryWithPoints$: Observable<PointsCalculatorEntryWithPoints[]>;
    nextRanking$: Observable<{ futureBelPts: number; futureRanking: string, currentBelPts: number, currentRanking: string }>;

    constructor(
        private readonly tabtNavigator: TabsNavigationService,
        private readonly rankingService: RankingService,
        private readonly pointsCalculatorService: PointCalculatorService,
        private readonly store: Store,
        private readonly translateService: TranslateService,
        private readonly dialogService: DialogService,
        private readonly actionSheetCtrl: ActionSheetController,
        private readonly analyticsService: AnalyticsService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly ionRouter: IonRouterOutlet,
    ) {
        super();
    }

    ngOnInit(): void {
        this.playerCategories$ = this.store.select(UserState.availablePlayerCategories).pipe(
            map((categories: PLAYER_CATEGORY[]) =>
                categories.filter(category => [PLAYER_CATEGORY.WOMEN, PLAYER_CATEGORY.MEN].includes(category))
            )
        );

        this.store.select(UserState.getMainPlayerCategory).pipe(
            takeUntil(this.ngUnsubscribe)
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
                    map((resultsEntries) => [currentMemberEntry, resultsEntries, currentCategory])
                );
            }),
            map(([memberEntry, resultsEntries, currentCategory]: [MemberEntry, PointsCalculatorEntryWithPoints[], PLAYER_CATEGORY]) => {
                let basePoints = this.rankingService.getPoints(memberEntry.RankingPointsEntries, RankingMethodName.BEL_POINTS);
                const resultEntriesWithPoints: PointsCalculatorEntryWithPoints[] = [];
                for (const entry of resultsEntries) {
                    const pointsWon = this.pointsCalculatorService.calculatePoints(entry, basePoints, currentCategory);
                    basePoints = basePoints + pointsWon;
                    resultEntriesWithPoints.push({...entry, basePoints, pointsWon});
                }
                return resultEntriesWithPoints;
            }),
            shareReplay(1)
        );
        // this.pointsEntryWithPoints$.pipe(takeUntil(this.ngUnsubscribe), delay(100)).subscribe(() => this.changeDetectorRef.markForCheck());
        this.pivot$ = this.currentCategory$.pipe(
            map((category: PLAYER_CATEGORY) => category === PLAYER_CATEGORY.MEN ?
                pivotRankingEquivalenceMen :
                pivotRankingEquivalenceWomen
            )
        );
        const lastPoints$ = this.pointsEntryWithPoints$.pipe(
            map((results) => results?.[results.length - 1]),
        );

        this.nextRanking$ = combineLatest([
            lastPoints$,
            this.currentMemberEntry$,
            this.pivot$,
            this.currentCategory$
        ]).pipe(
            map(([lastPoints, memberEntry, pivot, category]) => {
                console.log('next ranking', {
                    futureBelPts: lastPoints?.basePoints,
                    futureRanking: lastPoints?.basePoints < pivot ?
                        this.rankingService.getEquivalentRanking(lastPoints?.basePoints, 0, category) :
                        '>= C0',
                    currentBelPts: this.rankingService.getPoints(memberEntry.RankingPointsEntries, RankingMethodName.BEL_POINTS),
                    currentRanking: memberEntry.Ranking
                });
                return ({
                    futureBelPts: lastPoints?.basePoints,
                    futureRanking: lastPoints?.basePoints < pivot ?
                        this.rankingService.getEquivalentRanking(lastPoints?.basePoints, 0, category) :
                        '>= C0',
                    currentBelPts: this.rankingService.getPoints(memberEntry.RankingPointsEntries, RankingMethodName.BEL_POINTS),
                    currentRanking: memberEntry.Ranking
                });
            }),
        );
    }

    addEntry(): void {
        this.analyticsService.logEvent('calculator_go_to_create_result');
        this.dialogService.showModal({
            component: IndividualMatchPointsEditorComponent,
            swipeToClose: true,
            presentingElement: this.ionRouter.nativeEl
        });
        // this.tabtNavigator.navigateTo(['points-calculator', 'edition']);
    }

    delete(entry: PointsCalculatorEntryWithPoints): void {
        this.store.dispatch(new Remove(PointsCalculatorState, [entry.id]));
    }

    reset() {
        this.analyticsService.logEvent('calculator_reset');

        this.dialogService.showAlert({
            header: this.translateService.instant('CALCULATOR.RESET'),
            buttons: [
                {
                    text: this.translateService.instant('COMMON.CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: 'Oui',
                    handler: () => {
                        this.store.dispatch(new Reset(PointsCalculatorState));
                    }
                }
            ]
        });
    }


    categoryChanged(event: CustomEvent) {
        this.currentCategory$.next(event.detail.value);
    }


    editEntry(entry: PointsCalculatorEntryWithPoints) {
        this.dialogService.showModal({
            component: IndividualMatchPointsEditorComponent,
            swipeToClose: true,
            handle: true,
            componentProps: {
                entry
            },
            presentingElement: this.ionRouter.nativeEl
        });
    }
}
