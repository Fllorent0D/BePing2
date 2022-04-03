/* tslint:disable */
/* eslint-disable */
import { ClubEntry } from './club-entry';
import { MemberEntry } from './member-entry';
export interface RegistrationEntry {
  Club: ClubEntry;
  Member: MemberEntry;
  RegistrationDate: string;
  UniqueIndex: number;
}
