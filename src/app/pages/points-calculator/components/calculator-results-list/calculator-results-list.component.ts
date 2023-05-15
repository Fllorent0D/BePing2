import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PointsCalculatorEntryWithPoints} from '../../../../core/store/points/points-calculator-state.service';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController} from '@ionic/angular';
import {RankingService} from '../../../../core/services/tabt/ranking.service';

@Component({
    selector: 'beping-calculator-results-list',
    templateUrl: './calculator-results-list.component.html',
    styleUrls: ['./calculator-results-list.component.css']
})
export class CalculatorResultsListComponent {

    @Input() pointsEntryWithPoints: PointsCalculatorEntryWithPoints[];
    @Input() nextRanking: { futureBelPts: number; futureRanking: string, currentBelPts: number, currentRanking: string };
    @Input() currentCategory: PLAYER_CATEGORY;
    @Input() hasPoints: boolean;
    @Input() pivot: number;

    @Output() add: EventEmitter<void> = new EventEmitter<void>();
    @Output() delete: EventEmitter<PointsCalculatorEntryWithPoints> = new EventEmitter<PointsCalculatorEntryWithPoints>();
    @Output() edit: EventEmitter<PointsCalculatorEntryWithPoints> = new EventEmitter<PointsCalculatorEntryWithPoints>();

    constructor(
        private readonly analyticsService: AnalyticsService,
        private readonly dialogService: DialogService,
        private readonly translateService: TranslateService,
        private readonly actionSheetCtrl: ActionSheetController,
        private readonly rankingService: RankingService
    ) {
    }

    async showItemOption(entry: PointsCalculatorEntryWithPoints) {
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: this.translateService.instant('CALCULATOR.EDIT_RESULT'),
                    id: 'edit-button',
                    handler: () => {
                        this.analyticsService.logEvent('calculator_edit_item');
                        this.edit.emit(entry);
                    }
                }, {
                    text: this.translateService.instant('CALCULATOR.DELETE_RESULT'),
                    role: 'destructive',
                    id: 'delete-button',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        this.analyticsService.logEvent('calculator_delete_item');
                        this.delete.emit(entry);
                    }
                }, {
                    text: this.translateService.instant('COMMON.CANCEL'),
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }]
        });
        await actionSheet.present();
        await actionSheet.onDidDismiss();
    }

    addEntry() {
        this.add.emit();
    }


    showPivot() {
        this.analyticsService.logEvent('calculator_show_pivot_info');

        this.dialogService.showAlert({
            message: this.translateService.instant('CALCULATOR.POINTS_OVER_PIVOT', {pivot: this.pivot}),
            cssClass: 'ion-text-wrap',
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel'
                }
            ]
        });

    }
}
