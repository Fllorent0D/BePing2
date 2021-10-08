import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MemberSummaryPerRankingComponent} from './member-summary-per-ranking.component';

describe('MemberSummaryPerRankingComponent', () => {
    let component: MemberSummaryPerRankingComponent;
    let fixture: ComponentFixture<MemberSummaryPerRankingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemberSummaryPerRankingComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberSummaryPerRankingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
