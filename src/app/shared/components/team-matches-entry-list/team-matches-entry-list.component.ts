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

    weekSelected: FormControl<number>;
    currentWeekNameSelected$: Observable<number>;
    teamMatchofSelectedWeek$: Observable<TeamMatchesEntry[]>;
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
        );

    }

    findCurrentWeekName() {
        return 1;
    }

    identify(index: number, item: TeamMatchesEntry){
        return item.MatchUniqueId;
    }

}
