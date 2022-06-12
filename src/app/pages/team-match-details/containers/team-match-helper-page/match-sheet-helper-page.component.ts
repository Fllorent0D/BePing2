import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {MembersService} from '../../../../core/api/services/members.service';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {Location} from '@angular/common';

@Component({
    selector: 'beping-team-match-helper-page',
    templateUrl: './match-sheet-helper-page.component.html',
    styleUrls: ['./match-sheet-helper-page.component.css']
})
export class MatchSheetHelperPage implements OnInit {

    match$: Observable<TeamMatchesEntry>;
    match: TeamMatchesEntry;

    homeMembers$: Observable<MemberEntry[]>;
    awayMembers$: Observable<MemberEntry[]>;
    club: 'home' | 'away' = 'home';

    constructor(
        private readonly matchesService: MatchesService,
        private readonly membersService: MembersService,
        private readonly location: Location
    ) {
    }

    ngOnInit(): void {
        const {match} = this.location.getState() as { match: TeamMatchesEntry };
        this.match = match;

        this.homeMembers$ = this.membersService.findAllMembers({
            club: match.HomeClub,
            playerCategory: match.DivisionCategory
        });

        this.awayMembers$ = this.membersService.findAllMembers({
            club: match.AwayClub,
            playerCategory: match.DivisionCategory
        });

    }


}
