/* tslint:disable */
/* eslint-disable */
import {DoubleTeam} from './double-team';
import {Player} from './player';

export interface Players {
  DoubleTeamCount: number;
  DoubleTeams?: Array<DoubleTeam>;
  PlayerCount: number;
  Players?: Array<Player>;
}
