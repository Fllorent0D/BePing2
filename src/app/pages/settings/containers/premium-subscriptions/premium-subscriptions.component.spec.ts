import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumSubscriptionsComponent } from './premium-subscriptions.component';

describe('PremiumSubscriptionsComponent', () => {
  let component: PremiumSubscriptionsComponent;
  let fixture: ComponentFixture<PremiumSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumSubscriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
