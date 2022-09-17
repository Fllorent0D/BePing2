import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepLinkBaseComponent } from './deep-link-base.component';

describe('DeepLinkBaseComponentComponent', () => {
  let component: DeepLinkBaseComponent;
  let fixture: ComponentFixture<DeepLinkBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeepLinkBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeepLinkBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
