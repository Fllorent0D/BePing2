import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MatchesService} from '../../../../core/api/services/matches.service';
import {map, switchMap} from 'rxjs/operators';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {Observable} from 'rxjs';

@Component({
    selector: 'beping-team-match-details',
    templateUrl: './team-match-details-page.component.html',
    styleUrls: ['./team-match-details-page.component.scss']
})
export class TeamMatchDetailsPage implements OnInit {

    match$: Observable<TeamMatchesEntry>;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly matchesService: MatchesService
    ) {
    }

    ngOnInit() {
        this.match$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => params.get('uniqueIndex') as string),
            switchMap((uniqueIndex: string) => this.matchesService.findMatchById({matchUniqueId: uniqueIndex, withDetails: true}))
        );
    }

}
