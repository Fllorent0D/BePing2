/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { MemberEntryResultEntry } from './member-entry-result-entry';
import { Phone } from './phone';
import { RankingPointsEntry } from './ranking-points-entry';
export interface MemberEntry {
  Address?: Address;
  BirthDate?: string;
  Category: string;
  Club: string;
  Email?: string;
  FirstName: string;
  Gender: string;
  LastName: string;
  MedicalAttestation?: boolean;
  NationalNumber?: string;
  Phone?: Phone;
  Position: number;
  Ranking: string;
  RankingIndex: number;
  RankingPointsCount?: number;
  RankingPointsEntries?: Array<RankingPointsEntry>;
  ResultCount?: number;
  ResultEntries?: Array<MemberEntryResultEntry>;
  Status: string;
  UniqueIndex: number;
}
