import {Component, OnInit} from '@angular/core';
import {EVENT_TYPE} from '../../helpers/points';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {OnDestroyHook} from '../../../../core/on-destroy-hook';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {DialogService} from '../../../../shared/services/dialog-service.service';
import {IonRouterOutlet} from '@ionic/angular';
import {SearchMemberComponent} from '../../../modals/search-player/search-member.component';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {RankingMethodName, RankingService} from '../../../../core/services/tabt/ranking.service';

@Component({
    selector: 'beping-individual-match-points-editor',
    templateUrl: './individual-match-points-editor.component.html',
    styleUrls: ['./individual-match-points-editor.component.css']
})
export class IndividualMatchPointsEditorComponent extends OnDestroyHook implements OnInit {
    EVENT_TYPE = EVENT_TYPE;
    PLAYER_CATEGORY = PLAYER_CATEGORY;
    formGroup: FormGroup;

    constructor(
        private readonly dialogService: DialogService,
        private readonly ionRouterOutlet: IonRouterOutlet,
        private readonly rankingService: RankingService
    ) {
        super();
    }

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            category: new FormControl(null, [Validators.required]),
            opponent: new FormControl(null, []),
            matchResult: new FormControl(null, [Validators.required]),
            eventType: new FormControl(null, [Validators.required]),
            eventId: new FormControl(null, [Validators.required])
        });

        this.formGroup.get('eventType').valueChanges.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((value: string) => {
            this.formGroup.get('eventId').reset();
        });

        this.formGroup.get('category').valueChanges.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((value: string) => {
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

        const result = await modal.onWillDismiss();
        if (result.data.member) {
            this.formGroup.get('opponent').patchValue(result.data.member);
        }

    }

    belRanking(member: MemberEntry): string {
        return this.rankingService.getPoints(member.RankingPointsEntries, RankingMethodName.BEL_POINTS);
    }

}
