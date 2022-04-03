import {Component, Input, OnInit} from '@angular/core';
import {Head2HeadData} from '../../../../../core/api/models/head-2-head-data';

@Component({
    selector: 'beping-face-to-face-summary',
    templateUrl: './face-to-face-summary.component.html',
    styleUrls: ['./face-to-face-summary.component.css']
})
export class FaceToFaceSummaryComponent implements OnInit {

    @Input() head2headData: Head2HeadData;

    constructor() {
    }

    ngOnInit(): void {
    }

    playerPct(): number {
        return ((this.head2headData.victoryCount / this.head2headData.head2HeadCount) * 100);
    }

    opponentPct(): number {
        return ((this.head2headData.defeatCount / this.head2headData.head2HeadCount) * 100);
    }

}
