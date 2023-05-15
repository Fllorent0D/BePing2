/* tslint:disable */
/* eslint-disable */
import {NumericRankingPerWeekOpponentsV3} from './numeric-ranking-per-week-opponents-v-3';

export interface NumericRankingDetailsV3 {
  basePoints: number;
  competitionContext: string;
  competitionType: 'championship' | 'tournament';
  date: string;
  endPoints: number;
  opponents: Array<NumericRankingPerWeekOpponentsV3>;
}
