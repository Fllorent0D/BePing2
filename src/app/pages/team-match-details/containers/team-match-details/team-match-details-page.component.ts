import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {Store} from '@ngxs/store';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {ClubEntry} from '../../../../core/api/models/club-entry';

@Component({
    selector: 'beping-team-match-details',
    templateUrl: './team-match-details-page.component.html',
    styleUrls: ['./team-match-details-page.component.scss']
})
export class TeamMatchDetailsPage implements OnInit {

    match$: Observable<TeamMatchesEntry>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly matchesService: MatchesService,
        private readonly tabsNavigation: TabsNavigationService,
        private readonly clubService: ClubsService,
        private readonly store: Store
    ) {
    }

    ngOnInit() {
        this.match$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => Number(params.get('uniqueIndex'))),
            switchMap((uniqueIndex: number) => this.matchesService.findMatchById({matchUniqueId: uniqueIndex, withDetails: true})),
            shareReplay(1)
        );
    }

    navigateToTeamPage(clubIndex: string, clubTeam: string, divisionId: number) {
        this.store.select(ClubsState.getClubByUniqueIndex(clubIndex)).pipe(
            map((club: ClubEntry) => clubTeam.replace(club.Name, '').trim()),
            switchMap((teamName) =>
                this.clubService.findClubTeams({clubIndex}).pipe(
                    map((teams: TeamEntry[]) => teams.find((team) => team.Team === teamName && team.DivisionId === divisionId))
                )
            ),
            take(1)
        ).subscribe((team) => {
            this.tabsNavigation.navigateTo(['clubs', clubIndex, 'team', team.TeamId]);
        });
    }

    navigateToPlayer(memberUniqueIndex: number) {
        this.tabsNavigation.navigateTo(['player', memberUniqueIndex.toString()]);
    }


}
