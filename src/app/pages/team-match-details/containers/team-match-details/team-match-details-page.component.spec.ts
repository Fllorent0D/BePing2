import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamMatchDetailsPage} from './team-match-details-page.component';

describe('TeamMatchDetailsComponent', () => {
    let component: TeamMatchDetailsPage;
    let fixture: ComponentFixture<TeamMatchDetailsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamMatchDetailsPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TeamMatchDetailsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
