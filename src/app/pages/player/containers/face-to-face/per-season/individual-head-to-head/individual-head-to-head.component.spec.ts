import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IndividualHeadToHeadComponent} from './individual-head-to-head.component';

describe('IndividualHeadToHeadComponent', () => {
  let component: IndividualHeadToHeadComponent;
  let fixture: ComponentFixture<IndividualHeadToHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualHeadToHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualHeadToHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
