import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'beping-skeleton-large-item-list-component',
    templateUrl: './skeleton-large-item-list-component.component.html',
})
export class SkeletonLargeItemListComponentComponent implements OnInit {

    @Input() rows = 16;
    skeletonRows: number[];


    ngOnInit(): void {
        this.skeletonRows = [...Array(this.rows).keys()].map(() => Math.floor(Math.random() * 40) + 30);
    }

}
