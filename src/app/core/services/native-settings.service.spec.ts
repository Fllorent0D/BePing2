import {TestBed} from '@angular/core/testing';

import {NativeSettingsService} from './native-settings.service';

describe('NativeSettingsService', () => {
  let service: NativeSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
