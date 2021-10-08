import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MemberNameRankingInfoComponent} from './member-name-ranking-info.component';

describe('MemberNameRankingInfoComponent', () => {
    let component: MemberNameRankingInfoComponent;
    let fixture: ComponentFixture<MemberNameRankingInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemberNameRankingInfoComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberNameRankingInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
