import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonItemTeamMatchComponent } from './ion-item-team-match.component';

describe('IonItemTeamMatchComponent', () => {
  let component: IonItemTeamMatchComponent;
  let fixture: ComponentFixture<IonItemTeamMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonItemTeamMatchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonItemTeamMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
