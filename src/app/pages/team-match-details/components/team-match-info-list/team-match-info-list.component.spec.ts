import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMatchInfoListComponent } from './team-match-info-list.component';

describe('TeamMatchInfoListComponent', () => {
  let component: TeamMatchInfoListComponent;
  let fixture: ComponentFixture<TeamMatchInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMatchInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMatchInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
