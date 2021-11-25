import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsCalculatorPageComponent } from './points-calculator-page.component';

describe('PointsCalculatorPageComponent', () => {
  let component: PointsCalculatorPageComponent;
  let fixture: ComponentFixture<PointsCalculatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsCalculatorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsCalculatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
