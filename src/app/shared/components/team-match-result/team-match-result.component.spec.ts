import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamMatchResultComponent} from './team-match-result.component';

describe('TeamMatchResultComponent', () => {
    let component: TeamMatchResultComponent;
    let fixture: ComponentFixture<TeamMatchResultComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamMatchResultComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TeamMatchResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
