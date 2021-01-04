import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {Observable} from 'rxjs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {map, switchMap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {ClubMembersListService} from '../../../../core/services/tabt/club-members-list.service';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {VenueEntry} from '../../../../core/api/models/venue-entry';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {AbstractPageTabsComponent} from '../../../../shared/helpers/abstract-page-tabs/abstract-page-tabs.component';

@Component({
    selector: 'beping-club',
    templateUrl: './club.page.html',
    styleUrls: ['./club.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubPage extends AbstractPageTabsComponent implements OnInit {
    club$: Observable<ClubEntry>;
    members$: Observable<MemberEntry[]>;
    venues$: Observable<VenueEntry[]>;
    teams$: Observable<TeamEntry[]>;
    matches: Observable<TeamMatchesEntry[]>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly store: Store,
        private readonly tabsNavigationService: TabsNavigationService,
        private readonly clubService: ClubsService,
        private readonly matchesService: MatchesService,
        private readonly clubMembersListService: ClubMembersListService,
        protected readonly changeDetectionRef: ChangeDetectorRef
    ) {
        super(changeDetectionRef);
    }

    ngOnInit() {

        this.club$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => params.get('uniqueIndex') as string),
            switchMap((uniqueIndex: string) => this.store.select(ClubsState.getClubByUniqueIndex(uniqueIndex)))
        );

        this.teams$ = this.club$.pipe(
            switchMap((club) => this.clubService.findClubTeams({clubIndex: club.UniqueIndex}))
        );

        this.matches = this.club$.pipe(
            switchMap((club) => this.matchesService.findAllMatches({club: club.UniqueIndex}))
        );

        this.venues$ = this.club$.pipe(
            map((club) => club.VenueEntries)
        );

        this.members$ = this.club$.pipe(
            switchMap((club: ClubEntry) => this.clubService.findClubMembers({clubIndex: club.UniqueIndex})),
            map((members: MemberEntry[]) => this.clubMembersListService.transformToClubMembersList(members))
        );
    }

    navigateToPlayer() {
        this.tabsNavigationService.navigateTo(['player']);
    }

    navigateToTeamPage(team: TeamEntry, club: ClubEntry) {
        this.router.navigate(['.', 'team', team.TeamId], {
            state: {club, team}
        });
    }

    updateTabIndex(event) {
        console.log(event);
    }


}

