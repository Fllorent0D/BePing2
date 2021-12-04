/* tslint:disable */
/* eslint-disable */
import {VenueEntry} from './venue-entry';

export interface ClubEntry {
  Category: number;
  CategoryName: string;
  LongName: string;
  Name: string;
  UniqueIndex: string;
  VenueCount: number;
  VenueEntries: Array<VenueEntry>;
}
