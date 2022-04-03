import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'beping-add-to-calendar-btn',
    templateUrl: './add-to-calendar-btn.component.html',
    styleUrls: ['./add-to-calendar-btn.component.css']
})
export class AddToCalendarBtnComponent {
    @Output() addToCalendarClicked = new EventEmitter<void>();
}
