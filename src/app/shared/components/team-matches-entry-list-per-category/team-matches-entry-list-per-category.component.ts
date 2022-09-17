import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {FormControl} from '@angular/forms';
import {map, take, tap} from 'rxjs/operators';
import {combineLatest, merge, Observable} from 'rxjs';
import {groupBy} from '../../../core/utils/group-by';
import {DivisionEntry} from '../../../core/api/models/division-entry';

@Component({
    selector: 'beping-team-matches-entry-list-per-category',
    templateUrl: './team-matches-entry-list-per-category.component.html',
    styleUrls: ['./team-matches-entry-list-per-category.component.css']
})
export class TeamMatchesEntryListPerCategoryComponent implements OnInit {

    @Input() teamMatchEntries$: Observable<TeamMatchesEntry[]>;

    weekSelected: FormControl<number>;
    currentWeekNameSelected$: Observable<number>;
    teamMatchofSelectedWeek$: Observable<{
        category: string,
        teamMatches: TeamMatchesEntry[]
    }[]>;
    maxWeekName$: Observable<number>;
    predictedWeekName$: Observable<number>;

    constructor() {
    }

    ngOnInit(): void {
        this.weekSelected = new FormControl<number>(1);

        this.predictedWeekName$ = this.teamMatchEntries$.pipe(
            map((matches) => {
                try {
                    const today = Date.now();
                    const futureMatches = matches.filter((m) => new Date(m.Date).getTime() > today);
                    const groupedByWeek = groupBy(futureMatches, 'WeekName');

                    if (groupedByWeek.length === 1) {
                        return Number(groupedByWeek[0][0].WeekName);
                    }

                    const mean = Math.round(groupedByWeek.map((group) => group.length).reduce((a, b) => a + b, 0) / groupedByWeek.length);
                    const first = groupedByWeek.find(group => [mean, mean - 1, mean + 1].includes(group.length));
                    console.log('first:::', first);
                    return Number(first[0].WeekName);
                } catch (err) {
                    return 1;
                }

            }),
            take(1)
        );
        this.currentWeekNameSelected$ = merge(
            this.weekSelected.valueChanges,
            this.predictedWeekName$
        ).pipe(
            tap(week => this.weekSelected.setValue(week, {emitEvent: false}))
        );

        this.maxWeekName$ = this.teamMatchEntries$.pipe(
            map((matches) => Math.max(...matches.map((m) => Number(m.WeekName)))),
        );
        this.teamMatchofSelectedWeek$ = combineLatest([
            this.currentWeekNameSelected$,
            this.teamMatchEntries$
        ]).pipe(
            map(([weekName, matches]) => matches.filter((match) => Number(match.WeekName) === weekName)),
            map((teamMatches: TeamMatchesEntry[]) => {
                // TODO to make parametrized in settings
                const order = ['MEN', 'MEN_POST_23', 'WOMEN', 'WOMEN_POST_23', 'YOUTH', 'YOUTH_POST_23', 'VETERANS', 'VETERANS_WOMEN'];
                return teamMatches.reduce<{ category: string, teamMatches: TeamMatchesEntry[] }[]>
                ((acc, item) => {
                    const category = item.DivisionCategory ?? 'OTHER';
                    const groupIndex = acc.findIndex(i => i.category === category);
                    if (groupIndex === -1) {
                        acc.push({category, teamMatches: [item]});
                    } else {
                        acc[groupIndex].teamMatches.push(item);
                    }
                    return acc;
                }, []).sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
            })
        );

    }

    findCurrentWeekName() {
        return 1;
    }

    identify(index: number, item: TeamMatchesEntry) {
        return item.MatchUniqueId;
    }

}
