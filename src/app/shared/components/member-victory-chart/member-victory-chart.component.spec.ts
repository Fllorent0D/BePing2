import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MemberVictoryChartComponent} from './member-victory-chart.component';

describe('MemberVictoryChartComponent', () => {
    let component: MemberVictoryChartComponent;
    let fixture: ComponentFixture<MemberVictoryChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemberVictoryChartComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberVictoryChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
