import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FaceToFaceComponent} from './face-to-face.component';

describe('FaceToFaceComponent', () => {
  let component: FaceToFaceComponent;
  let fixture: ComponentFixture<FaceToFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceToFaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceToFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
