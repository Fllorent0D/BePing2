/* tslint:disable */
/* eslint-disable */
import {IndividualMatchResult} from './individual-match-result';
import {Players} from './players';

export interface MatchDetails {
  AwayCaptain: number;
  AwayPlayers: Players;
  AwayScore: number;
  CommentCount: number;
  CommentEntries: Array<string>;
  DetailsCreated: boolean;
  EndTime: string;
  HallCommissioner: number;
  HomeCaptain: number;
  HomePlayers: Players;
  HomeScore: number;
  IndividualMatchResults: Array<IndividualMatchResult>;
  MatchSystem: number;
  Referee: number;
  StartTime: string;
}
