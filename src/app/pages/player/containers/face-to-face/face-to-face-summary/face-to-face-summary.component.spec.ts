import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FaceToFaceSummaryComponent} from './face-to-face-summary.component';

describe('FaceToFaceSummaryComponent', () => {
  let component: FaceToFaceSummaryComponent;
  let fixture: ComponentFixture<FaceToFaceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceToFaceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceToFaceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
