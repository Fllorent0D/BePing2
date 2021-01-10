import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TeamMatchPlayerListComponent } from './team-match-player-list.component';

describe('TeamMatchPlayerListComponent', () => {
  let component: TeamMatchPlayerListComponent;
  let fixture: ComponentFixture<TeamMatchPlayerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMatchPlayerListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamMatchPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
