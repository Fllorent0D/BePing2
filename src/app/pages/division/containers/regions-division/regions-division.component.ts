import {Component, OnInit} from '@angular/core';
import {Level} from '../../../../core/models/level';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {Select, Store} from '@ngxs/store';
import {DivisionsState} from '../../../../core/store/divisions';
import {map, take} from 'rxjs/operators';
import {DivisionEntry} from '../../../../core/api/models/division-entry';
import {Observable} from 'rxjs';
import {TABT_DATABASES} from '../../../../core/interceptors/tabt-database-interceptor.service';
import {SettingsState} from '../../../../core/store/settings';
import {DialogService} from '../../../../core/services/dialog-service.service';

@Component({
    selector: 'beping-regions-division',
    templateUrl: './regions-division.component.html',
    styleUrls: ['./regions-division.component.scss']
})
export class RegionsDivisionComponent implements OnInit {

    Level = Level;

    @Select(SettingsState.getCurrentDatabase) database$: Observable<TABT_DATABASES>;
    TABT_DATABASES = TABT_DATABASES;

    constructor(
        private readonly tabRouting: TabsNavigationService,
        private readonly store: Store,
        private readonly dialogService: DialogService
    ) {
    }

    ngOnInit() {
    }

    navigateToDivisionList(level: Level) {
        if (level === Level.SUPER_DIVISION) {
            this.store.select(DivisionsState.getDivisionByLevel(Level.SUPER_DIVISION)).pipe(
                take(1)
            ).subscribe((divisions: DivisionEntry[]) => {
                if (divisions.length === 1) {
                    this.tabRouting.navigateTo(['divisions', divisions[0].DivisionId.toString(10)]);
                } else {
                    this.tabRouting.navigateTo(['divisions', 'regions', level]);
                }
            });
        } else {
            this.tabRouting.navigateTo(['divisions', 'regions', level]);
        }
    }

    navigateSuperWomen() {
        this.store.select(DivisionsState.entities).pipe(
            map((divisions) =>
                divisions.find((div: DivisionEntry) => div.DivisionCategory === 'WOMEN' && div.DivisionName.includes('SUPER'))),
            take(1)
        ).subscribe(division => {
            if (division) {
                this.tabRouting.navigateTo(['divisions', division.DivisionId.toString(10)]);
            } else {
                this.dialogService.showToast({
                    message: 'Not found',
                    color: 'danger'
                });
            }
        });
    }

}
