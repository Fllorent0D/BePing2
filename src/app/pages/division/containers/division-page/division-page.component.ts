import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractPageTabsComponent} from '../../../../shared/helpers/abstract-page-tabs/abstract-page-tabs.component';
import {ActivatedRoute, Params} from '@angular/router';
import {Store} from '@ngxs/store';
import {DivisionsService} from '../../../../core/api/services/divisions.service';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {combineLatest, Observable} from 'rxjs';
import {RankingEntry} from '../../../../core/api/models/ranking-entry';
import {map, share, shareReplay, switchMap, take} from 'rxjs/operators';
import {DivisionEntry} from '../../../../core/api/models/division-entry';
import {DivisionsState} from '../../../../core/store/divisions';
import {MemberResults} from '../../../../core/api/models/member-results';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {ClubsState} from '../../../../core/store/clubs';
import {ClubEntry} from '../../../../core/api/models/club-entry';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {ClubsService} from '../../../../core/api/services/clubs.service';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {FavoritesState, ToggleDivisionFromFavorites} from '../../../../core/store/favorites';
import {NotificationType} from '@capacitor/haptics';
import {HapticsService} from '../../../../core/services/haptics.service';

@Component({
    selector: 'beping-division-page',
    templateUrl: './division-page.component.html',
    styleUrls: ['./division-page.component.scss']
})
export class DivisionPageComponent extends AbstractPageTabsComponent implements OnInit {

    divisionId$: Observable<number>;
    ranking$: Observable<RankingEntry[]>;
    division$: Observable<DivisionEntry>;
    memberRanking$: Observable<MemberResults[]>;
    matches$: Observable<TeamMatchesEntry[]>;
    isFavorite$: Observable<boolean>;

    constructor(
        protected readonly changeDetectionRef: ChangeDetectorRef,
        protected readonly activatedRouted: ActivatedRoute,
        protected readonly store: Store,
        protected readonly divisionService: DivisionsService,
        protected readonly matchesService: MatchesService,
        private readonly clubsService: ClubsService,
        private readonly tabsNavigation: TabsNavigationService,
    ) {
        super(changeDetectionRef);
    }

    ngOnInit() {
        this.divisionId$ = this.activatedRouted.params.pipe(
            map((params: Params) => Number(params.divisionId)),
            shareReplay(1)
        );

        this.isFavorite$ = this.divisionId$.pipe(
            switchMap((id) => this.store.select(FavoritesState.isDivisionInFavorite(id)))
        );

        this.ranking$ = this.divisionId$.pipe(
            switchMap((id: number) => this.divisionService.findDivisionRanking({divisionId: id}))
        );

        this.division$ = this.divisionId$.pipe(
            switchMap((id: number) => this.store.select(DivisionsState.getDivisionByUniqueIndex(id))),
            shareReplay(1)
        );

        this.memberRanking$ = this.divisionId$.pipe(
            switchMap((id: number) => this.divisionService.findDivisionMembers({divisionId: id})),
            share()
        );

        this.matches$ = this.divisionId$.pipe(
            switchMap((id: number) => this.matchesService.findAllMatches({divisionId: id})),
            share()
        );


    }

    isSameTeam(rankingEntry: RankingEntry, team: TeamEntry, club: ClubEntry): boolean {
        return rankingEntry.TeamClub === club.UniqueIndex && rankingEntry.Team === (club.LongName + ' ' + team.Team).trim();
    }

    navigateToTeam(rankingEntry: RankingEntry) {
        console.log(rankingEntry);

        combineLatest([
            this.store.select(ClubsState.getClubByUniqueIndex(rankingEntry.TeamClub)),
            this.clubsService.findClubTeams({clubIndex: rankingEntry.TeamClub})
        ]).pipe(
            take(1),
            map(([clubEntry, teams]: [ClubEntry, TeamEntry[]]) => ({
                    team: teams.find((team) => this.isSameTeam(rankingEntry, team, clubEntry)),
                    club: clubEntry
                })
            )
        ).subscribe(({team, club}) => {
            this.tabsNavigation.navigateTo(['clubs', club.UniqueIndex, 'team', team.TeamId]);
        });

    }

    navigateToPlayer(uniqueIndex: number) {
        this.tabsNavigation.navigateTo(['player', uniqueIndex.toString(10)]);
    }

    toggleFavorite() {
        this.division$.pipe(
            take(1),
            switchMap((division: DivisionEntry) => this.store.dispatch(new ToggleDivisionFromFavorites(division)))
        ).subscribe();
    }
}
