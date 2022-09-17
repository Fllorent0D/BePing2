import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionIonListComponent } from './selection-ion-list.component';

describe('SelectionIonListComponent', () => {
  let component: SelectionIonListComponent;
  let fixture: ComponentFixture<SelectionIonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionIonListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionIonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
