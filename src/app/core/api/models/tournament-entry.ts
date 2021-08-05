/* tslint:disable */
/* eslint-disable */
export interface TournamentEntry {
  DateFrom: string;
  DateTo: string;
  ExternalIndex: string;
  Level: number;
  Name: string;
  RegistrationDate: string;
  SerieCount: number;
  SerieEntries: Array<string>;
  UniqueIndex: number;
  Venue: {
    Name: string;
    Street: string;
    Town: string;
  };
}
