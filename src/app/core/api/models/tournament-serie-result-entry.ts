/* tslint:disable */
/* eslint-disable */
import {Player} from './player';

export interface TournamentSerieResultEntry {
  AwayPlayer: Array<Player>;
  AwayPlayerMatchIndex: Array<string>;
  AwayPlayerUniqueIndex: Array<string>;
  AwaySetCount: number;
  HomePlayer: Array<Player>;
  HomePlayerMatchIndex: Array<string>;
  HomePlayerUniqueIndex: Array<string>;
  HomeSetCount: number;
  IsAwayForfeited: boolean;
  IsHomeForfeited: boolean;
  Position: number;
  Scores: string;
}
