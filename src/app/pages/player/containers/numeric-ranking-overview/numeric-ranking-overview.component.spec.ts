import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericRankingOverviewComponent } from './numeric-ranking-overview.component';

describe('NumericRankingOverviewComponent', () => {
  let component: NumericRankingOverviewComponent;
  let fixture: ComponentFixture<NumericRankingOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericRankingOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericRankingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
