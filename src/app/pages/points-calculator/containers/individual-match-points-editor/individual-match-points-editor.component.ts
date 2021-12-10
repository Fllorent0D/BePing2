import {Component, OnInit} from '@angular/core';
import {coefficientPerEvent, EVENT_TYPE, MATCH_RESULT} from '../../../../core/models/points';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {filter, map, take, takeUntil} from 'rxjs/operators';
import {OnDestroyHook} from '../../../../core/on-destroy-hook';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {DialogService} from '../../../../shared/services/dialog-service.service';
import {IonRouterOutlet, NavController} from '@ionic/angular';
import {SearchMemberComponent} from '../../../modals/search-player/search-member.component';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {RankingMethodName, RankingService} from '../../../../core/services/tabt/ranking.service';
import {PointsCalculatorEntry, PointsCalculatorState} from '../../../../core/store/points/points-calculator-state.service';
import {Store} from '@ngxs/store';
import {Add} from '@ngxs-labs/entity-state';
import {PointCalculatorService} from '../../services/point-calculator.service';
import {UserState} from '../../../../core/store/user/user.state';

@Component({
    selector: 'beping-individual-match-points-editor',
    templateUrl: './individual-match-points-editor.component.html',
    styleUrls: ['./individual-match-points-editor.component.css']
})
export class IndividualMatchPointsEditorComponent extends OnDestroyHook implements OnInit {

    EVENT_TYPE = EVENT_TYPE;
    MATCH_RESULT = MATCH_RESULT;
    coefficientPerEvent = coefficientPerEvent;
    PLAYER_CATEGORY = PLAYER_CATEGORY;
    formGroup: FormGroup;

    constructor(
        private readonly dialogService: DialogService,
        private readonly ionRouterOutlet: IonRouterOutlet,
        private readonly rankingService: RankingService,
        private readonly ionNav: NavController,
        private readonly pointsCalculator: PointCalculatorService,
        private readonly store: Store
    ) {
        super();
    }

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            category: new FormControl(null, [Validators.required]),
            opponentName: new FormControl(null, [Validators.required]),
            opponentRanking: new FormControl(null, [Validators.required]),
            matchResult: new FormControl(null, [Validators.required]),
            eventType: new FormControl(null, [Validators.required]),
            eventId: new FormControl(null, [Validators.required])
        });
        this.store.select(UserState.availablePlayerCategories).pipe(
            map((categories: PLAYER_CATEGORY[]) =>
                categories.filter(category => [PLAYER_CATEGORY.WOMEN, PLAYER_CATEGORY.MEN].includes(category))
            ),
            take(1),
            filter(cats => cats.length === 1),
            map((cats) => cats[0])
        ).subscribe((category) => {
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
        ).subscribe(() => {
            this.formGroup.get('opponent').reset();
        });

    }

    async chooseMember() {
        const modal = await this.dialogService.showModal({
            component: SearchMemberComponent,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl,
            componentProps: {
                showNumericRanking: true,
                memberCategory: this.formGroup.get('category').value
            }
        });

        const result = await modal.onWillDismiss<{ member: MemberEntry | null }>();
        if (result.data.member) {
            this.formGroup.get('opponentName').patchValue(`${result.data.member.FirstName} ${result.data.member.LastName}`);
            this.formGroup.get('opponentRanking').patchValue(
                Number(this.rankingService.getPoints(result.data.member.RankingPointsEntries, RankingMethodName.BEL_POINTS))
            );
        }

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
        this.store.dispatch(new Add(PointsCalculatorState, resultEntry));
        this.ionNav.back();
    }

}
