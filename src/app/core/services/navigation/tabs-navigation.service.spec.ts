import { TestBed } from '@angular/core/testing';

import { TabsNavigationService } from './tabs-navigation.service';

describe('TabsNavigationService', () => {
  let service: TabsNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabsNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
