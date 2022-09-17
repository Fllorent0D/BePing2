import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'beping-skeleton-item-list-component',
    templateUrl: './skeleton-item-list-component.component.html',
    styleUrls: ['./skeleton-item-list-component.component.css']
})
export class SkeletonItemListComponentComponent implements OnInit {

    @Input() rows = 16;
    skeletonRows: number[];


    ngOnInit(): void {
        this.skeletonRows = [...Array(this.rows).keys()].map(() => Math.floor(Math.random() * 40) + 30);
    }

}
