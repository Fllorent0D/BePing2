import {TestBed} from '@angular/core/testing';

import {IsProService} from './is-pro.service';

describe('IsProService', () => {
  let service: IsProService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsProService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
