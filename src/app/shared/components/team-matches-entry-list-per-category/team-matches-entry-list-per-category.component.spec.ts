import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamMatchesEntryListPerCategoryComponent} from './team-matches-entry-list-per-category.component';

describe('TeamMatchesEntryListComponent', () => {
  let component: TeamMatchesEntryListPerCategoryComponent;
  let fixture: ComponentFixture<TeamMatchesEntryListPerCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMatchesEntryListPerCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMatchesEntryListPerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
