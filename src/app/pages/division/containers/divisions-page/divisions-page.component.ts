import {Component, OnInit} from '@angular/core';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {DivisionEntry} from '../../../../core/api/models/division-entry';
import {DivisionsState} from '../../../../core/store/divisions';
import {Level} from '../../../../core/models/level';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {DIVISION_CATEGORY, PLAYER_CATEGORY} from 'src/app/core/models/user';
import {group} from '@angular/animations';

@Component({
    selector: 'beping-divisions-page',
    templateUrl: './divisions-page.component.html',
    styleUrls: ['./divisions-page.component.scss']
})
export class DivisionsPageComponent implements OnInit {

    level$: Observable<Level>;
    divisions$: Observable<{
        category: string,
        divisions: DivisionEntry[]
    }[]>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly store: Store,
        private readonly tabRouting: TabsNavigationService
    ) {
    }

    ngOnInit() {
        this.level$ = this.activatedRoute.params.pipe(
            map((params: Params): Level => params?.['level'] as Level),
            shareReplay(1)
        );
        this.divisions$ = this.level$.pipe(
            switchMap((level: Level) => this.store.select(DivisionsState.getDivisionByLevel(level))),
            map((divisions: DivisionEntry[]) => {
                // TODO to make parametrized in settings
                const order = ['MEN', 'MEN_POST_23', 'WOMEN', 'WOMEN_POST_23', 'YOUTH', 'YOUTH_POST_23', 'VETERANS', 'VETERANS_WOMEN',];
                return divisions.reduce<{ category: string, divisions: DivisionEntry[] }[]>
                ((acc, item) => {
                    const category = item.DivisionCategory ?? 'OTHER';
                    const groupIndex = acc.findIndex(i => i.category === category);
                    if (groupIndex === -1) {
                        acc.push({category, divisions: [item]});
                    } else {
                        acc[groupIndex].divisions.push(item);
                    }
                    return acc;
                }, []).sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
            })
        );
    }

    divisionClicked(division: DivisionEntry) {
        this.tabRouting.navigateTo(['divisions', division.DivisionId.toString(10)]);

    }
}
