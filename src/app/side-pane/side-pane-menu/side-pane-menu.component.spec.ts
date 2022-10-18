import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePaneMenuComponent } from './side-pane-menu.component';

describe('SidePaneMenuComponent', () => {
  let component: SidePaneMenuComponent;
  let fixture: ComponentFixture<SidePaneMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidePaneMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePaneMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
