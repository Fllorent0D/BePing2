import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {RankingHistoryGraphsComponent} from './ranking-history-graphs.component';

describe('RankingHistoryGraphsComponent', () => {
  let component: RankingHistoryGraphsComponent;
  let fixture: ComponentFixture<RankingHistoryGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingHistoryGraphsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RankingHistoryGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
