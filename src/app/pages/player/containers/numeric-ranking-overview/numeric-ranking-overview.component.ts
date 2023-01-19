import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {WeeklyNumericRankingV3} from '../../../../core/api/models/weekly-numeric-ranking-v-3';
import {NumericRankingDetailsV3} from '../../../../core/api/models/numeric-ranking-details-v-3';

@Component({
  selector: 'beping-numeric-ranking-overview',
  templateUrl: './numeric-ranking-overview.component.html',
  styleUrls: ['./numeric-ranking-overview.component.scss']
})
export class NumericRankingOverviewComponent implements OnInit {

  weeklyRanking: NumericRankingDetailsV3[];

  constructor(
      private readonly location: Location,

  ) { }

  ngOnInit(): void {
    console.log(this.location.getState());

    this.weeklyRanking = ((this.location.getState() as any)?.weeklyRanking as NumericRankingDetailsV3[]) ?? [];
  }

}
