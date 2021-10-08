import {TestBed} from '@angular/core/testing';

import {PlayerCategoryService} from './player-category.service';

describe('PlayerCategoryService', () => {
    let service: PlayerCategoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlayerCategoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
