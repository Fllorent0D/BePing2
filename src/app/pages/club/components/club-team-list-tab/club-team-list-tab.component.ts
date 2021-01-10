import {Component, Input, OnInit} from '@angular/core';
import {TeamEntry} from '../../../../core/api/models/team-entry';
import {ClubEntry} from '../../../../core/api/models/club-entry';

@Component({
  selector: 'beping-club-team-list-tab',
  templateUrl: './club-team-list-tab.component.html',
  styleUrls: ['./club-team-list-tab.component.scss'],
})
export class ClubTeamListTabComponent implements OnInit {

  @Input() teams: TeamEntry[] = [];
  @Input() club: ClubEntry

  constructor() { }

  ngOnInit() {}

}
