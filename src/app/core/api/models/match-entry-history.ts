/* tslint:disable */
/* eslint-disable */
import { TeamMatchesEntry } from './team-matches-entry';
export interface MatchEntryHistory {
  date: string;
  matchEntry: TeamMatchesEntry;
  opponentRanking: string;
  playerRanking: string;
  score: string;
  season?: number;
}
