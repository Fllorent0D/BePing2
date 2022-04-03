/* tslint:disable */
/* eslint-disable */
import { MatchEntryHistory } from './match-entry-history';
import { PlayersInfo } from './players-info';
export interface Head2HeadData {
  defeatCount: number;
  firstVictory?: string;
  head2HeadCount: number;
  lastDefeat?: string;
  lastVictory?: string;
  matchEntryHistory: Array<MatchEntryHistory>;
  playersInfo: PlayersInfo;
  victoryCount: number;
}
