/* tslint:disable */
/* eslint-disable */
import {RankingEvaluationEntry} from './ranking-evaluation-entry';

export interface MemberEntryResultEntry {
  Club: string;
  CompetitionType: 'C' | 'T';
  Date: string;
  FirstName: string;
  LastName: string;
  MatchId?: string;
  MatchUniqueId?: string;
  Ranking: string;
  RankingEvaluationCount?: number;
  RankingEvaluationEntries?: Array<RankingEvaluationEntry>;
  Result: string;
  SetAgainst: number;
  SetFor: number;
  TeamName?: string;
  TournamentName?: string;
  TournamentSerieName?: string;
  UniqueIndex: number;
}
