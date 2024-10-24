import {Component, Input, OnInit, Optional} from '@angular/core';
import {EVENT_TYPE, EventCoefficient, MATCH_RESULT} from '../../../../core/models/points';
import {FormControl, FormGroup, UntypedFormControl, Validators} from '@angular/forms';
import {filter, map, take} from 'rxjs/operators';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {IonRouterOutlet, ModalController, NavController} from '@ionic/angular';
import {SearchMemberComponent} from '../../../modals/search-player/search-member.component';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {RankingService} from '../../../../core/services/tabt/ranking.service';
import {PointsCalculatorEntry, PointsCalculatorState} from '../../../../core/store/points/points-calculator-state.service';
import {Store} from '@ngxs/store';
import {Add, Update} from '@ngxs-labs/entity-state';
import {PointCalculatorService} from '../../services/point-calculator.service';
import {UserState} from '../../../../core/store/user/user.state';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {TranslateService} from '@ngx-translate/core';
import {MembersService} from '../../../../core/api/services/members.service';
import {WeeklyNumericRankingV3} from '../../../../core/api/models/weekly-numeric-ranking-v-3';

interface IndividualMatchPointsEditorFormGroup {
    category: FormControl<PLAYER_CATEGORY>;
    opponentName: FormControl<string>;
    opponentRanking: FormControl<number>;
    matchResult: FormControl<MATCH_RESULT>;
    eventType: FormControl<EVENT_TYPE>;
    eventId: FormControl<string>;
}

@UntilDestroy()
@Component({
    selector: 'beping-individual-match-points-editor',
    templateUrl: './individual-match-points-editor.component.html',
    styleUrls: ['./individual-match-points-editor.component.css']
})
export class IndividualMatchPointsEditorComponent implements OnInit {

    EVENT_TYPE = EVENT_TYPE;
    MATCH_RESULT = MATCH_RESULT;
    coefficientPerEvent: { [key: string]: EventCoefficient[] };
    PLAYER_CATEGORY = PLAYER_CATEGORY;
    formGroup: FormGroup<IndividualMatchPointsEditorFormGroup>;

    @Input() memberEntryPrefill: MemberEntry | undefined;
    @Input() entry: PointsCalculatorEntry;

    constructor(
        private readonly dialogService: DialogService,
        private readonly modalCtrl: ModalController,
        private readonly rankingService: RankingService,
        private readonly ionNav: NavController,
        private readonly translate: TranslateService,
        private readonly pointsCalculator: PointCalculatorService,
        private readonly store: Store,
        private readonly analyticsService: AnalyticsService,
        @Optional() public readonly ionRouterOutlet: IonRouterOutlet,
        private readonly membersService: MembersService,
    ) {
    }

    ngOnInit(): void {
        console.log(this.entry);
        this.formGroup = new FormGroup<IndividualMatchPointsEditorFormGroup>({
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
            untilDestroyed(this)
        ).subscribe(() => {
            this.formGroup.get('eventId').reset();
        });

        this.formGroup.get('category').valueChanges.pipe(
            untilDestroyed(this)
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
            canDismiss: true,
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
        if(memberEntry.Category){
            this.formGroup.get('category').setValue(memberEntry.Category as PLAYER_CATEGORY, {emitEvent: false});
        }
        const points = this.membersService.findMemberNumericRankingsHistoryV3({
            uniqueIndex: memberEntry.UniqueIndex,
            category: this.formGroup.get('category').value as PLAYER_CATEGORY,
        }).pipe(
            take(1),
        ).subscribe((ranking: WeeklyNumericRankingV3) => {
            const points = ranking.actualPoints;
            if (!points) {
                this.dialogService.showErrorAlert({
                    message: this.translate.instant('CALCULATOR.PLAYER_NO_BEL_POINTS')
                });
                return;
            }
            if (disableCategory) {
                this.formGroup.get('category').setValue(memberEntry.Category as PLAYER_CATEGORY, {emitEvent: false});
                this.formGroup.get('category').disable({emitEvent: false});
                this.formGroup.get('opponentName').disable();

                this.coefficientPerEvent = this.pointsCalculator.getCoefficentEventForCategory(memberEntry.Category as PLAYER_CATEGORY);
            }
            this.formGroup.get('opponentName').patchValue(`${memberEntry.FirstName} ${memberEntry.LastName}`);
            this.formGroup.get('opponentRanking').patchValue(points);
        });

    }

    save() {
        const resultEntry: PointsCalculatorEntry = {
            eventId: this.formGroup.get('eventId').value,
            opponentName: this.formGroup.get('opponentName').value,
            opponentRanking: this.formGroup.get('opponentRanking').value,
            victory: this.formGroup.get('matchResult').value,
            category: this.formGroup.get('category').value,
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
