import { TestBed } from '@angular/core/testing';

import { StartNavigationService } from './start-navigation.service';

describe('StartNavigationService', () => {
  let service: StartNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
