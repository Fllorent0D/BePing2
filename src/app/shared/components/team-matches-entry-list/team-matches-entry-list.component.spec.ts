import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamMatchesEntryListComponent} from './team-matches-entry-list.component';

describe('TeamMatchesEntryListComponent', () => {
  let component: TeamMatchesEntryListComponent;
  let fixture: ComponentFixture<TeamMatchesEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMatchesEntryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMatchesEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
