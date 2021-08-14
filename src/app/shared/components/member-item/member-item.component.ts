import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MemberEntry} from '../../../core/api/models/member-entry';

@Component({
  selector: 'beping-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {

  @Input() member: MemberEntry;
  @Input() detail: boolean;
  @Output() memberClicked: EventEmitter<MemberEntry> = new EventEmitter<MemberEntry>()

  constructor() { }

  ngOnInit() {}

}
