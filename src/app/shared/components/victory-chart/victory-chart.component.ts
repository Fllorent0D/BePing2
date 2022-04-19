import {Component, Input} from '@angular/core';
import {animate, keyframes, style, transition, trigger} from '@angular/animations';

export const circleAnimations =
    trigger('circleAnimation', [
        transition(':enter', [
            style({'stroke-dasharray': '0, 100', 'stroke-dashoffset': '{{strokeOffsetStart}}'}),
            animate('1.8s 1s cubic-bezier(0.76, 0, 0.24, 1)', keyframes([
                style({'stroke-dasharray': '{{dasharray}}', 'stroke-dashoffset': '{{strokeOffset}}'})
            ]))
        ])
    ]);

@Component({
    selector: 'beping-victory-chart',
    templateUrl: './victory-chart.component.html',
    styleUrls: ['./victory-chart.component.scss'],
    animations: [circleAnimations]
})
export class VictoryChartComponent {

    @Input() bluePct = 50;
    @Input() redPct = 50;
    @Input() title = '';
    @Input() subtitle?: string;
    @Input() small = false;


    get blueDashArray(): string {
        return `${(this.bluePct - 4 <= 0) ? 0 : this.bluePct - 4}, ${100 - this.bluePct + 4}`;
    }


    get redDashArray(): string {
        return `${(this.redPct - 4 <= 0) ? 0 : this.redPct - 4}, ${100 - this.redPct + 4}`;
    }

}
