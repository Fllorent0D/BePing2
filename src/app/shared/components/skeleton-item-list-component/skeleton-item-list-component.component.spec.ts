import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonItemListComponentComponent } from './skeleton-item-list-component.component';

describe('SkeletonItemListComponentComponent', () => {
  let component: SkeletonItemListComponentComponent;
  let fixture: ComponentFixture<SkeletonItemListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkeletonItemListComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonItemListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
