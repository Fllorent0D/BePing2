import { TestBed } from '@angular/core/testing';

import { HasSeenOnboardingGuard } from './has-seen-onboarding.guard';

describe('HasSeenOnboardingGuard', () => {
  let guard: HasSeenOnboardingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HasSeenOnboardingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
