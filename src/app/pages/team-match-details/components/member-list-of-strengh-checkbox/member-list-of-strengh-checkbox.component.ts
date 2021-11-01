import {Component, Input} from '@angular/core';
import {MemberEntry} from '../../../../core/api/models/member-entry';

@Component({
    selector: 'beping-member-list-of-strengh-checkbox',
    templateUrl: './member-list-of-strengh-checkbox.component.html',
    styleUrls: ['./member-list-of-strengh-checkbox.component.css']
})
export class MemberListOfStrenghCheckboxComponent {

    @Input() players: MemberEntry[];

}
