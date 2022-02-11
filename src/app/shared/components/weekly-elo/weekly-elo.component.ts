import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';
import {fr} from 'date-fns/locale';
import 'chartjs-adapter-date-fns';
import {WeeklyNumericRanking} from '../../../core/api/models/weekly-numeric-ranking';
import {equivalenceRankingBelPtsMen} from '../../../core/models/bel-ranking';

@Component({
    selector: 'beping-weekly-elo',
    templateUrl: './weekly-elo.component.html',
    styleUrls: ['./weekly-elo.component.scss']
})
export class WeeklyEloComponent implements OnInit, AfterViewInit {
    private dataset: WeeklyNumericRanking[];

    type = 'line';
    data: ChartData;
    options: ChartOptions;
    viewInit = false;
    @Input() prop: string;
    @Input() label: string;
    @Input() color: string;
    @Input() marginVertical = true;

    @ViewChild('canvasElement') canvas: ElementRef<HTMLCanvasElement>;

    @Input() set numericRankings(numericRankings: WeeklyNumericRanking[]) {
        this.dataset = numericRankings;
        this.computeData();
    }


    constructor() {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        this.viewInit = true;
        this.computeData();
    }

    computeData() {
        if (!this.viewInit) {
            return;
        }
        const ctx = this.canvas?.nativeElement.getContext('2d');

        const purpleOrangeGradient = ctx.createLinearGradient(0, 0, 0, 800);
        purpleOrangeGradient.addColorStop(1, 'rgba(146,146,146,0.4)');
        purpleOrangeGradient.addColorStop(0, 'rgba(234,231,234,0)');

        this.data = {
            labels: this.dataset.map(week => week.weekName),
            datasets: [
                {
                    label: this.label,
                    data: this.dataset.map(week => week[this.prop]),
                    tension: 0.5,
                    pointBackgroundColor: this.color,
                    pointBorderColor: this.color,
                    borderColor: this.color,
                    backgroundColor: purpleOrangeGradient,
                    hoverBackgroundColor: purpleOrangeGradient,
                    fill: true
                }
            ]
        };

        this.options = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true
                    }
                }
            },
            layout: {
                padding: {
                    left: -200,
                    bottom: 0
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
                        minUnit: 'week',
                        displayFormats: {
                            day: 'dd/MM',
                            week: 'dd/MM',
                            month: 'MMM',
                            quarter: 'MMM',
                            year: 'MM/YYYY'
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        mirror: false
                    }
                },
                y: {
                    grid: {
                        display: true,
                        drawBorder: false
                    },
                    ticks: {
                        mirror: true,
                        stepSize: 5
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
                    borderCapStyle: 'round',
                    borderWidth: 3
                }
            }
        };
        if (this.dataset.length === 1) {
            // @ts-ignore
            this.options.scales.x.time.unit = 'day';
            this.options.elements.point.radius = 4;
        }
        console.log(this.data);

    }

}
