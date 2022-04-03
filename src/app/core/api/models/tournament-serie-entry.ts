/* tslint:disable */
/* eslint-disable */
import { RegistrationEntry } from './registration-entry';
import { TournamentSerieResultEntry } from './tournament-serie-result-entry';
export interface TournamentSerieEntry {
  Name: string;
  RegistrationCount?: number;
  RegistrationEntries?: Array<RegistrationEntry>;
  ResultCount?: number;
  ResultEntries?: Array<TournamentSerieResultEntry>;
  UniqueIndex: number;
}
