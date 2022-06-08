import {Component, Input, OnInit, Optional} from '@angular/core';
import {EVENT_TYPE, EventCoefficient, MATCH_RESULT} from '../../../../core/models/points';
import {Form, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {filter, map, take, takeUntil} from 'rxjs/operators';
import {OnDestroyHook} from '../../../../core/on-destroy-hook';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {IonRouterOutlet, ModalController, NavController} from '@ionic/angular';
import {SearchMemberComponent} from '../../../modals/search-player/search-member.component';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {RankingMethodName, RankingService} from '../../../../core/services/tabt/ranking.service';
import {PointsCalculatorEntry, PointsCalculatorState} from '../../../../core/store/points/points-calculator-state.service';
import {Store} from '@ngxs/store';
import {Add, Update} from '@ngxs-labs/entity-state';
import {PointCalculatorService} from '../../services/point-calculator.service';
import {UserState} from '../../../../core/store/user/user.state';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';

@Component({
    selector: 'beping-individual-match-points-editor',
    templateUrl: './individual-match-points-editor.component.html',
    styleUrls: ['./individual-match-points-editor.component.css']
})
export class IndividualMatchPointsEditorComponent extends OnDestroyHook implements OnInit {

    EVENT_TYPE = EVENT_TYPE;
    MATCH_RESULT = MATCH_RESULT;
    coefficientPerEvent: { [key: string]: EventCoefficient[] };
    PLAYER_CATEGORY = PLAYER_CATEGORY;
    formGroup: FormGroup;

    @Input() memberEntryPrefill: MemberEntry | undefined;
    @Input() entry: PointsCalculatorEntry;

    constructor(
        private readonly dialogService: DialogService,
        private readonly modalCtrl: ModalController,
        private readonly rankingService: RankingService,
        private readonly ionNav: NavController,
        private readonly pointsCalculator: PointCalculatorService,
        private readonly store: Store,
        private readonly analyticsService: AnalyticsService,
        @Optional() public readonly ionRouterOutlet: IonRouterOutlet,
    ) {
        super();
    }

    ngOnInit(): void {
        console.log(this.entry);
        this.formGroup = new FormGroup({
            category: new FormControl(this.entry?.category, [Validators.required]),
            opponentName: new FormControl(this.entry?.opponentName, [Validators.required]),
            opponentRanking: new FormControl(this.entry?.opponentRanking, [Validators.required]),
            matchResult: new FormControl(this.entry?.victory, [Validators.required]),
            eventType: new FormControl(this.entry?.eventType, [Validators.required]),
            eventId: new FormControl(this.entry?.eventId, [Validators.required])
        });
        if (this.memberEntryPrefill) {
            this.setMemberInForm(this.memberEntryPrefill, true);
        }

        this.store.select(UserState.availablePlayerCategories).pipe(
            map((categories: PLAYER_CATEGORY[]) =>
                categories.filter(category => [PLAYER_CATEGORY.WOMEN, PLAYER_CATEGORY.MEN].includes(category))
            ),
            take(1),
            filter(cats => cats.length === 1),
            map((cats) => cats[0])
        ).subscribe((category) => {
            this.coefficientPerEvent = this.pointsCalculator.getCoefficentEventForCategory(category as PLAYER_CATEGORY);
            this.formGroup.get('category').setValue(category);
            this.formGroup.get('category').disable({emitEvent: true});
        });
        this.formGroup.get('eventType').valueChanges.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(() => {
            this.formGroup.get('eventId').reset();
        });

        this.formGroup.get('category').valueChanges.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((category) => {
            this.coefficientPerEvent = this.pointsCalculator.getCoefficentEventForCategory(category as PLAYER_CATEGORY);
            this.formGroup.get('opponentName').reset();
            this.formGroup.get('opponentRanking').reset();
            this.formGroup.get('eventId').reset();
        });

    }

    async chooseMember() {
        const topModal = await this.modalCtrl.getTop();
        const modal = await this.dialogService.showModal({
            component: SearchMemberComponent,
            swipeToClose: true,
            presentingElement: topModal,
            componentProps: {
                showNumericRanking: true,
                memberCategory: this.formGroup.get('category').value
            }
        });

        const result = await modal.onWillDismiss<{ member: MemberEntry | null }>();
        if (result.data.member) {
            this.setMemberInForm(result.data.member, false);
        }

    }

    setMemberInForm(memberEntry: MemberEntry, disableCategory: boolean) {
        if (disableCategory) {
            this.formGroup.get('category').setValue(memberEntry.Category, {emitEvent: false});
            this.formGroup.get('category').disable({emitEvent: false});
            this.formGroup.get('opponentName').disable();

            this.coefficientPerEvent = this.pointsCalculator.getCoefficentEventForCategory(memberEntry.Category as PLAYER_CATEGORY);
        }
        this.formGroup.get('opponentName').patchValue(`${memberEntry.FirstName} ${memberEntry.LastName}`);
        this.formGroup.get('opponentRanking').patchValue(
            Number(this.rankingService.getPoints(memberEntry.RankingPointsEntries, RankingMethodName.BEL_POINTS))
        );
    }

    save() {
        const resultEntry: PointsCalculatorEntry = {
            eventId: this.formGroup.get('eventId').value,
            opponentName: this.formGroup.get('opponentName').value,
            opponentRanking: this.formGroup.get('opponentRanking').value,
            victory: this.formGroup.get('matchResult').value as MATCH_RESULT,
            category: this.formGroup.get('category').value as PLAYER_CATEGORY,
            eventType: this.formGroup.get('eventType').value,
        };
        this.analyticsService.logEvent('calculator_save_result', {
            eventId: resultEntry.eventId,
            eventType: resultEntry.eventType,
            category: resultEntry.category,
            matchResult: resultEntry.victory
        });
        if (this.entry) {
            this.store.dispatch(new Update(PointsCalculatorState, this.entry.id, resultEntry));
        } else {
            this.store.dispatch(new Add(PointsCalculatorState, resultEntry));
        }
        if (this.ionRouterOutlet) {
            this.ionNav.back();
        } else {
            this.modalCtrl.dismiss({added: true});
        }
    }

    async closeModal(): Promise<void> {
        this.analyticsService.logEvent('calculator_dismiss_modal');
        await this.modalCtrl.dismiss({added: false});
    }

    getControl(control: string): UntypedFormControl {
        return this.formGroup.get(control) as UntypedFormControl;
    }
}
