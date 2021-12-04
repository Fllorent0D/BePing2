import { TestBed } from '@angular/core/testing';

import { PointCalculatorService } from './point-calculator.service';

describe('PointCalculatorService', () => {
  let service: PointCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
