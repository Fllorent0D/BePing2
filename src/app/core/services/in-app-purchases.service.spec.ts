import {TestBed} from '@angular/core/testing';

import {InAppPurchasesService} from './in-app-purchases.service';

describe('InAppPurchasesService', () => {
  let service: InAppPurchasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InAppPurchasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
