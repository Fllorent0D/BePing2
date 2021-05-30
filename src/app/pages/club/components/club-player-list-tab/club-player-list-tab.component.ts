import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MemberEntry} from '../../../../core/api/models/member-entry';

@Component({
  selector: 'beping-club-player-list-tab',
  templateUrl: './club-player-list-tab.component.html',
  styleUrls: ['./club-player-list-tab.component.scss'],
})
export class ClubPlayerListTabComponent implements OnInit {

  @Input() members: MemberEntry[] = [];
  @Output() memberClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

}
