import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertFullPageComponent } from './alert-full-page.component';

describe('AlertFullPageComponent', () => {
  let component: AlertFullPageComponent;
  let fixture: ComponentFixture<AlertFullPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertFullPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertFullPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
