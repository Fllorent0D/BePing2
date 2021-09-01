import {Component, OnInit} from '@angular/core';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {DivisionEntry} from '../../../../core/api/models/division-entry';
import {DivisionsState} from '../../../../core/store/divisions';
import {Level} from '../../../../core/models/level';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';

@Component({
    selector: 'beping-divisions-page',
    templateUrl: './divisions-page.component.html',
    styleUrls: ['./divisions-page.component.scss']
})
export class DivisionsPageComponent implements OnInit {

    level$: Observable<Level>;
    divisions$: Observable<DivisionEntry[]>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly store: Store,
        private readonly tabRouting: TabsNavigationService

    ) {
    }

    ngOnInit() {
        this.level$ = this.activatedRoute.params.pipe(
            map((params: Params) => params.level as Level),
            shareReplay(1)
        );
        this.divisions$ = this.level$.pipe(
            switchMap((level: Level) => this.store.select(DivisionsState.getDivisionByLevel(level)))
        );
    }

    divisionClicked(division: DivisionEntry) {
        this.tabRouting.navigateTo(['divisions', division.DivisionId.toString(10)]);

    }
}
