import {Component, Input, OnInit} from '@angular/core';
import {NumericRankingPerWeekOpponentsV3} from '../../../../core/api/models/numeric-ranking-per-week-opponents-v-3';

@Component({
  selector: 'beping-last-opponent',
  templateUrl: './last-opponent.component.html',
  styleUrls: ['./last-opponent.component.css']
})
export class LastOpponentComponent implements OnInit {

  @Input() lastOpponent: NumericRankingPerWeekOpponentsV3;

  constructor() { }

  ngOnInit(): void {
  }

}
