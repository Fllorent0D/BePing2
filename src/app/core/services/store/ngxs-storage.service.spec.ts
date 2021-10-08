import {TestBed} from '@angular/core/testing';

import {NgxsStorageService} from './ngxs-storage.service';

describe('NgxsStorageService', () => {
    let service: NgxsStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NgxsStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
