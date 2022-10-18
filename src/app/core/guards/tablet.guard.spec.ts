import { TestBed } from '@angular/core/testing';

import { TabletGuard } from './tablet.guard';

describe('TabletGuard', () => {
  let guard: TabletGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TabletGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
