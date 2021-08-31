/* tslint:disable */
/* eslint-disable */
import { TournamentSerieEntry } from './tournament-serie-entry';
export interface TournamentEntry {
  DateFrom: string;
  DateTo: string;
  ExternalIndex: string;
  Level: number;
  Name: string;
  RegistrationDate: string;
  SerieCount: number;
  SerieEntries: Array<TournamentSerieEntry>;
  UniqueIndex: number;
  Venue?: {
    Name: string
  };
}
