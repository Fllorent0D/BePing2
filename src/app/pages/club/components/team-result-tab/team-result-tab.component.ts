import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';

@Component({
  selector: 'beping-team-result-tab',
  templateUrl: './team-result-tab.component.html',
  styleUrls: ['./team-result-tab.component.scss'],
})
export class TeamResultTabComponent implements OnInit {

  @Input() matches: TeamMatchesEntry[] = [];

  constructor() { }

  ngOnInit() {}

}
