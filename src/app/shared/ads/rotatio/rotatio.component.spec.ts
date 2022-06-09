import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RotatioComponent} from './rotatio.component';

describe('RotatioComponent', () => {
  let component: RotatioComponent;
  let fixture: ComponentFixture<RotatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RotatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
