import {Component, Input} from '@angular/core';

@Component({
    selector: 'beping-loading-btn',
    templateUrl: './loading-btn.component.html',
    styleUrls: ['./loading-btn.component.scss']
})
export class LoadingBtnComponent {
    @Input() loading = false;
}

