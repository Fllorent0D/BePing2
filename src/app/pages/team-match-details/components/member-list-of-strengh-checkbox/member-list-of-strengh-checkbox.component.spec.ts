import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MemberListOfStrenghCheckboxComponent} from './member-list-of-strengh-checkbox.component';

describe('MemberListOfStrenghCheckboxComponent', () => {
  let component: MemberListOfStrenghCheckboxComponent;
  let fixture: ComponentFixture<MemberListOfStrenghCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberListOfStrenghCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberListOfStrenghCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
