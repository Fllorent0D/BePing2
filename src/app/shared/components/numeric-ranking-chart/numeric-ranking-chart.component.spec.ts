import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericRankingChartComponent } from './numeric-ranking-chart.component';

describe('NumericRankingChartComponent', () => {
  let component: NumericRankingChartComponent;
  let fixture: ComponentFixture<NumericRankingChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericRankingChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericRankingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
