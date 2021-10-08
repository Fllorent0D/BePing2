import {TestBed} from '@angular/core/testing';

import {ClubMembersListService} from './club-members-list.service';

describe('ClubMembersListService', () => {
    let service: ClubMembersListService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClubMembersListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
