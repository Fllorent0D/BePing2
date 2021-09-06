import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';
import {WeeklyElo} from '../../../core/api/models/weekly-elo';
import {fr} from 'date-fns/locale';
import 'chartjs-adapter-date-fns';

@Component({
    selector: 'beping-weekly-elo',
    templateUrl: './weekly-elo.component.html',
    styleUrls: ['./weekly-elo.component.scss']
})
export class WeeklyEloComponent implements AfterViewInit, OnInit {
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
                left: -200
            }
        },

        scales: {
            x: {
                type: 'time',
                adapters: {
                    date: {
                        locale: fr
                    }
                },
                time: {
                    minUnit: 'day'
                },
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
                    stepSize: 1
                    // callback: (tick, index) => index % 2 ? tick : ''

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
    @Input() weeklyElo: WeeklyElo[] = [];

    constructor() {
    }

    ngOnInit(): void {
        if (this.weeklyElo.length === 1) {
            this.options.elements.point.radius = 4;
        }
    }


    ngAfterViewInit() {
        const ctx = this.canvas.nativeElement.getContext('2d');

        const purpleOrangeGradient = ctx.createLinearGradient(0, 0, 0, 800);
        purpleOrangeGradient.addColorStop(1, 'rgba(146,146,146,0.4)');
        purpleOrangeGradient.addColorStop(0, 'rgba(234,231,234,0)');

        this.data = {
            labels: this.weeklyElo.map(week => week.weekName),

            datasets: [
                {
                    label: 'My First dataset',
                    data: this.weeklyElo.map(week => week.elo),
                    tension: 0.5,
                    pointBackgroundColor: '#5B8BF7',
                    pointBorderColor: '#5B8BF7',
                    backgroundColor: purpleOrangeGradient,
                    hoverBackgroundColor: purpleOrangeGradient,
                    fill: true
                }
            ]
        };

    }

}
