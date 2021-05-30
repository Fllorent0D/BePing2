import { TestBed } from '@angular/core/testing';

import { TeamPlayersStatsService } from './team-players-stats.service';

describe('TeamPlayersStatsService', () => {
  let service: TeamPlayersStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamPlayersStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
