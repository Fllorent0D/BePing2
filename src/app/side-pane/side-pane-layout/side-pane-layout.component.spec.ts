import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePaneLayoutComponent } from './side-pane-layout.component';

describe('SidePaneLayoutComponent', () => {
  let component: SidePaneLayoutComponent;
  let fixture: ComponentFixture<SidePaneLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidePaneLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePaneLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
