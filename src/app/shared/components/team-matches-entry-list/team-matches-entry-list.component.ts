import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {FormControl} from '@angular/forms';
import {map, take, tap} from 'rxjs/operators';
import {combineLatest, Observable, merge} from 'rxjs';

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
                const today = Date.now();
                const futureMatches = matches.filter((m) => new Date(m.Date).getTime() > today);
                return Number(groupBy(futureMatches, 'WeekName').filter((g) => g.length > 2)[0][0].WeekName);
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

        const groupBy = <T, K extends keyof T>(arr: T[], prop: K): T[][] => {
            const mapObj: Map<T[K], T[]> = new Map(Array.from(arr, obj => [obj[prop], []]));
            arr.forEach(obj => mapObj.get(obj[prop]).push(obj));
            return Array.from(mapObj.values());
        };


    }

    findCurrentWeekName() {
        return 1;
    }

}
