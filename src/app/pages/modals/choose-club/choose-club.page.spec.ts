import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseClubPage } from './choose-club.page';

describe('ChooseClubPage', () => {
  let component: ChooseClubPage;
  let fixture: ComponentFixture<ChooseClubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseClubPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseClubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
