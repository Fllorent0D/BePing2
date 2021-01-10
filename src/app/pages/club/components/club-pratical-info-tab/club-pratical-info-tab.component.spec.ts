import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClubPraticalInfoTabComponent } from './club-pratical-info-tab.component';

describe('ClubPraticalInfoTabComponent', () => {
  let component: ClubPraticalInfoTabComponent;
  let fixture: ComponentFixture<ClubPraticalInfoTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubPraticalInfoTabComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClubPraticalInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
