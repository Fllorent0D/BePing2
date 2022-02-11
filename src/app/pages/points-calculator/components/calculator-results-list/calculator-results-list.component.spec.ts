import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorResultsListComponent } from './calculator-results-list.component';

describe('CalculatorResultsListComponent', () => {
  let component: CalculatorResultsListComponent;
  let fixture: ComponentFixture<CalculatorResultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorResultsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
