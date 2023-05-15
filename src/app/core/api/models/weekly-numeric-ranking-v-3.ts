/* tslint:disable */
/* eslint-disable */
import {NumericRankingDetailsV3} from './numeric-ranking-details-v-3';
import {WeeklyNumericPointsV3} from './weekly-numeric-points-v-3';

export interface WeeklyNumericRankingV3 {
  perDateHistory: Array<NumericRankingDetailsV3>;
  points: Array<WeeklyNumericPointsV3>;
  actualPoints: number;
}
