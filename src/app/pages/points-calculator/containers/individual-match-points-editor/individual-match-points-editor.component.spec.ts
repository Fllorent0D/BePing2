import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMatchPointsEditorComponent } from './individual-match-points-editor.component';

describe('IndividualMatchPointsEditorComponent', () => {
  let component: IndividualMatchPointsEditorComponent;
  let fixture: ComponentFixture<IndividualMatchPointsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualMatchPointsEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMatchPointsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
