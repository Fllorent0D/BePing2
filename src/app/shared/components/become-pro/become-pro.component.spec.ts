import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BecomeProComponent} from './become-pro.component';

describe('BecomeProComponent', () => {
  let component: BecomeProComponent;
  let fixture: ComponentFixture<BecomeProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeProComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
