import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {FormControl} from '@angular/forms';
import {map, take, tap} from 'rxjs/operators';
import {combineLatest, merge, Observable} from 'rxjs';
import {groupBy} from '../../../core/utils/group-by';

@Component({
    selector: 'beping-team-matches-entry-list',
    templateUrl: './team-matches-entry-list.component.html',
    styleUrls: ['./team-matches-entry-list.component.css']
})
export class TeamMatchesEntryListComponent implements OnInit {

    @Input() teamMatchEntries$: Observable<TeamMatchesEntry[]>;

    weekSelected: FormControl;
    currentWeekNameSelected$: Observable<number>;
    teamMatchofSelectedWeek$: Observable<TeamMatchesEntry[]>;
    maxWeekName$: Observable<number>;
    predictedWeekName$: Observable<number>;

    constructor() {
    }

    ngOnInit(): void {
        this.weekSelected = new FormControl(1);

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
        );

    }

    findCurrentWeekName() {
        return 1;
    }

}
