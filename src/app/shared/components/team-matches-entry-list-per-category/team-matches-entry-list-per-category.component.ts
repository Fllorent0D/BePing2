import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {FormControl} from '@angular/forms';
import {map, take, tap} from 'rxjs/operators';
import {combineLatest, merge, Observable} from 'rxjs';
import {groupBy} from '../../../core/utils/group-by';

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
                    const matchesWithDate = matches.filter((match) => !!match.Date);
                    const groupedByWeek: TeamMatchesEntry[][] = groupBy(matchesWithDate, 'WeekName');
                    const meanDateByWeek = groupedByWeek.map((weekMatches: TeamMatchesEntry[]) =>
                        weekMatches.reduce((acc, val) => acc + new Date(val.Date).getTime(), 0) / weekMatches.length
                    );
                    const nextWeek = meanDateByWeek.findIndex((week) => week > today);
                    return nextWeek + 1;

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
