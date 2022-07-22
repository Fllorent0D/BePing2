import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizedBackBtnComponent } from './localized-back-btn.component';

describe('LocalizedBackBtnComponent', () => {
  let component: LocalizedBackBtnComponent;
  let fixture: ComponentFixture<LocalizedBackBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalizedBackBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizedBackBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
