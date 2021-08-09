import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';

@Component({
    selector: 'beping-weekly-elo',
    templateUrl: './weekly-elo.component.html',
    styleUrls: ['./weekly-elo.component.scss']
})
export class WeeklyEloComponent implements AfterViewInit {
    type = 'line';
    data: ChartData;
    options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                fullSize: true
            }
        },
        layout: {
            padding: {
                left: -100
            }
        },

        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                grid: {
                    display: true,
                    drawBorder: false
                },
                ticks: {
                    mirror: true,
                    padding: -5,
                    callback: (tick, index) => index % 2 ? tick : ''

                }
            }
        },
        animations: {
            y: {
                easing: 'easeInOutCubic',
                duration: 1500,
                delay: 1000,
                from: 160
            }
        },
        elements: {
            point: {
                radius: 0
            },
            line: {
                borderColor: '#5B8BF7',
                borderCapStyle: 'round',
                borderWidth: 3
            }
        }
    };
    @ViewChild('canvasElement') canvas: ElementRef<HTMLCanvasElement>;

    constructor() {
    }

    ngAfterViewInit() {
        const ctx = this.canvas.nativeElement.getContext('2d');
        const purpleOrangeGradient = ctx.createLinearGradient(0, 0, 0, 800);
        purpleOrangeGradient.addColorStop(1, 'rgba(146,146,146,0.4)');
        purpleOrangeGradient.addColorStop(0, 'rgba(234,231,234,0)');

        this.data = {
            labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'],

            datasets: [
                {
                    label: 'My First dataset',
                    data: [1221, 1221, 1161, 1143, 1119, 1119, 1147, 1172, 1142, 1160, 1160, 1191, 1189, 1189, 1217, 1217, 1257],
                    tension: 0.5,
                    backgroundColor: purpleOrangeGradient,
                    hoverBackgroundColor: purpleOrangeGradient,
                    fill: true
                }
            ]
        };
    }

}
