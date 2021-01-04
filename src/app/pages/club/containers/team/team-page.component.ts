import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractPageTabsComponent} from '../../../../shared/helpers/abstract-page-tabs/abstract-page-tabs.component';
import {combineLatest, Observable} from 'rxjs';
import {RankingEntry} from '../../../../core/api/models/ranking-entry';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {DivisionsService} from '../../../../core/api/services/divisions.service';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {map, switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {Store} from '@ngxs/store';

@Component({
    selector: 'beping-teams',
    templateUrl: './team-page.component.html',
    styleUrls: ['./team-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamPage extends AbstractPageTabsComponent implements OnInit {

    ranking$: Observable<RankingEntry[]>;
    players$: Observable<MemberEntry[]>;
    calendar$: Observable<TeamMatchesEntry[]>;

    teamId$: Observable<string>;
    team$: Observable<TeamEntry>;
    clubIndex$: Observable<string>;
    club$: Observable<ClubEntry>;


    constructor(
        private readonly divisionsService: DivisionsService,
        private readonly clubsService: ClubsService,
        private readonly matchsService: MatchesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly store: Store,
        protected readonly changeDetectionRef: ChangeDetectorRef
    ) {
        super(changeDetectionRef);
    }

    ngOnInit() {
        this.clubIndex$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => params.get('uniqueIndex') as string)
        );

        this.teamId$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => params.get('teamId') as string)
        );

        this.club$ = this.clubIndex$.pipe(
            switchMap((clubIndex: string) => this.store.select(ClubsState.getClubByUniqueIndex(clubIndex)))
        );

        this.team$ = combineLatest([
            this.clubIndex$,
            this.teamId$
        ]).pipe(
            switchMap(([clubIndex, teamId]) =>
                this.clubsService.findClubTeams({clubIndex}).pipe(
                    map((teams: TeamEntry[]) => teams.find((team) => team.TeamId === teamId))
                )
            )
        );

        this.calendar$ = combineLatest([
            this.clubIndex$,
            this.team$
        ]).pipe(
            switchMap(([clubIndex, team]) => this.matchsService.findAllMatches({
                club: clubIndex,
                team: team.Team,
                divisionId: team.DivisionId,
                withDetails: true
            }))
        );

        combineLatest([
            this.team$,
            this.calendar$,
            this.club$
        ]).pipe(
            map(([team, matches, club]: [TeamEntry, TeamMatchesEntry[], ClubEntry]) => {
                for (const match of matches) {
                    const teamName = (club.Name + ' ' + team.Team).trim();
                    const teamPosition = match.HomeTeam === teamName ? 'Home' : 'Away';
                    const oppositeTeam = teamPosition === 'Home' ? 'Away' : 'Home';
                }
                return;
            })
        ).subscribe(() => {

        });


        this.ranking$ = this.team$.pipe(
            switchMap((team: TeamEntry) => this.divisionsService.findDivisionRanking({divisionId: team.DivisionId}))
        );
    }

    isSameTeam(rankingEntry: RankingEntry, team: TeamEntry, club: ClubEntry): boolean {
        return rankingEntry.TeamClub === club.UniqueIndex && rankingEntry.Team === (club.LongName + ' ' + team.Team).trim();
    }

}
