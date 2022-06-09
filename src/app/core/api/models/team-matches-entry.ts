/* tslint:disable */
/* eslint-disable */
import {MatchDetails} from './match-details';
import {VenueEntry} from './venue-entry';

export interface TeamMatchesEntry {
  AwayClub: string;
  AwayTeam: string;
  Date: string;
  DivisionCategory: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
  DivisionId: number;
  DivisionName?: string;
  HomeClub: string;
  HomeTeam: string;
  IsAwayForfeited: boolean;
  IsAwayWithdrawn: boolean;
  IsHomeForfeited: boolean;
  IsHomeWithdrawn: boolean;
  IsLocked: boolean;
  IsValidated: boolean;
  MatchDetails?: MatchDetails;
  MatchId: string;
  MatchUniqueId: number;
  NextWeekName?: string;
  PreviousWeekName?: string;
  Score: string;
  Time: string;
  Venue: number;
  VenueClub: string;
  VenueEntry: VenueEntry;
  WeekName: string;
}
