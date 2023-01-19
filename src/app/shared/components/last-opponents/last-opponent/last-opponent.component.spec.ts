import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastOpponentComponent } from './last-opponent.component';

describe('LastOpponentComponent', () => {
  let component: LastOpponentComponent;
  let fixture: ComponentFixture<LastOpponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastOpponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastOpponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
