import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AnimationController} from '@ionic/angular/';

@Component({
    selector: 'beping-favorite-btn',
    templateUrl: './favorite-btn.component.html',
    styleUrls: ['./favorite-btn.component.scss']
})
export class FavoriteBtnComponent implements OnInit {

    @Input() enabled = false;
    @Output() clicked: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('starIcon', {read: ElementRef, static: true}) starIcon: ElementRef;

    constructor(
        private animationCtrl: AnimationController
    ) {
    }

    ngOnInit() {
        console.log(this.starIcon);
    }

    btnClicked() {
        this.clicked.emit();
        console.log(this.starIcon);

        const rotation = 60;
        const rotationCnt = 1;

        const squareA = this.animationCtrl.create()
            .addElement(this.starIcon.nativeElement)
            .duration(200)
            .easing('ease-in-out')
            .keyframes([
                {offset: 0, transform: 'rotate(' + (this.enabled ? '-' : '') + (rotation * rotationCnt).toString(10) + 'deg)'}
            ]);
        console.log(squareA);
        squareA.play();
    }
}
