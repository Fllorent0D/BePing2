import { TestBed } from '@angular/core/testing';

import { Face2FaceService } from './face-2-face.service';

describe('Face2FaceService', () => {
  let service: Face2FaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Face2FaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
