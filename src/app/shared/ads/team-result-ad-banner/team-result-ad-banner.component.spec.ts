import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamResultAdBannerComponent} from './team-result-ad-banner.component';

describe('TeamResultAdBannerComponent', () => {
    let component: TeamResultAdBannerComponent;
    let fixture: ComponentFixture<TeamResultAdBannerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamResultAdBannerComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TeamResultAdBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
