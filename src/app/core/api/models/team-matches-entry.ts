/* tslint:disable */
/* eslint-disable */
import { MatchDetails } from './match-details';
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
  IsAwayWithdrawn: string;
  IsHomeForfeited: boolean;
  IsHomeWithdrawn: string;
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
  VenueEntry: {  };
  WeekName: string;
}
