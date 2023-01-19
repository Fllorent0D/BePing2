import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastOpponentsComponent } from './last-opponents.component';

describe('LastOpponentsComponent', () => {
  let component: LastOpponentsComponent;
  let fixture: ComponentFixture<LastOpponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastOpponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastOpponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
