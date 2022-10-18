import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';
import {fr} from 'date-fns/locale';
import 'chartjs-adapter-date-fns';
import {WeeklyNumericRanking} from '../../../core/api/models/weekly-numeric-ranking';
import {findBoundPts} from '../../../core/models/bel-ranking';
import {RankingService} from '../../../core/services/tabt/ranking.service';
import {PLAYER_CATEGORY} from '../../../core/models/user';

@Component({
    selector: 'beping-numeric-ranking-chart',
    templateUrl: './numeric-ranking-chart.component.html',
    styleUrls: ['./numeric-ranking-chart.component.scss']
})
export class NumericRankingChartComponent implements OnInit, AfterViewInit {
    private dataset: WeeklyNumericRanking[];

    type = 'line';
    data: ChartData;
    options: ChartOptions = {};
    viewInit = false;
    @Input() label: string;
    @Input() color: string;
    @Input() marginVertical = true;
    @Input() category: PLAYER_CATEGORY;

    @ViewChild('canvasElement') canvas: ElementRef<HTMLCanvasElement>;

    @Input() set numericRankings(numericRankings: WeeklyNumericRanking[]) {
        this.dataset = numericRankings;
        this.computeData();
    }


    constructor(
        private readonly rankingService: RankingService
    ) {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        this.viewInit = true;
        this.computeData();
    }

    computeData() {
        if (!this.viewInit || !this.category) {
            return;
        }
        const ctx = this.canvas?.nativeElement.getContext('2d');

        const purpleOrangeGradient = ctx.createLinearGradient(0, 0, 0, 800);
        purpleOrangeGradient.addColorStop(1, 'rgba(146,146,146,0.4)');
        purpleOrangeGradient.addColorStop(0, 'rgba(234,231,234,0)');

        const points = this.dataset.map((pts) => pts.bel);
        const lowerPoints = Math.min(...points);
        const higherPoints = Math.max(...points);
        const lowerBoundPts = findBoundPts(lowerPoints, this.category);
        const higherBoundPts = findBoundPts(higherPoints, this.category);
        const {
            equivalenceRankingBelPts,
            pivotRankingEquivalence
        } = this.rankingService.getEquivalenceTableForCategory(this.category);
        const lowerIndex = Math.max(equivalenceRankingBelPts.indexOf(lowerBoundPts), 1);
        const higherIndex = Math.min(equivalenceRankingBelPts.indexOf(higherBoundPts) + 2, equivalenceRankingBelPts.length);
        const boundsToShow = (lowerPoints >= pivotRankingEquivalence) ? [] : equivalenceRankingBelPts.slice(lowerIndex, higherIndex);
        console.log('lower:::', lowerBoundPts);
        console.log('higher:::', higherBoundPts);
        console.log('lowerIndex:::', lowerIndex);
        console.log('higherIndex:::', higherIndex);
        console.log('bounds:::', boundsToShow);

        this.data = {
            labels: this.dataset.map(week => week.weekName),
            datasets: [
                {
                    label: this.label,
                    data: this.dataset.map(week => week.bel),
                    tension: 0.25,
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
                },
                annotation: {
                    annotations: boundsToShow.map((bounds) => ({
                        type: 'line',
                        scaleID: 'test',
                        yMin: bounds.lowerBound,
                        yMax: bounds.lowerBound,
                        borderColor: 'rgba(135,135,135,0.84)',
                        borderWidth: 1,
                        label: {
                            content: bounds.ranking,
                            font: {
                                size: 12
                            },
                            position: 'end',
                            borderJoinStyle: 'round',
                            borderRadius: 50,
                            backgroundColor: 'rgba(0,0,0,0.36)',
                            display: true,
                        },
                        borderDash: [10, 15],
                    })),
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
                    },
                    display: true
                },
                y: {
                    grid: {
                        display: true,
                        drawBorder: false
                    },
                    ticks: {
                        mirror: true,
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
