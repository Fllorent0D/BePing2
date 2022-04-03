import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCalendarBtnComponent } from './add-to-calendar-btn.component';

describe('AddToCalendarBtnComponent', () => {
  let component: AddToCalendarBtnComponent;
  let fixture: ComponentFixture<AddToCalendarBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToCalendarBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCalendarBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
