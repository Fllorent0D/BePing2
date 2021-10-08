import {TestBed} from '@angular/core/testing';

import {MemberSelectedService} from './member-selected.service';

describe('MemberSelectedService', () => {
    let service: MemberSelectedService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MemberSelectedService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
