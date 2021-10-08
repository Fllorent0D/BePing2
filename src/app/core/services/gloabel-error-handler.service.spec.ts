import {TestBed} from '@angular/core/testing';

import {GloabelErrorHandlerService} from './gloabel-error-handler.service';

describe('GloabelErrorHandlerService', () => {
    let service: GloabelErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GloabelErrorHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
