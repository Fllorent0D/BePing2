import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {InfoTeamMatchComponent} from './info-team-match.component';

describe('InfoTeamMatchComponent', () => {
    let component: InfoTeamMatchComponent;
    let fixture: ComponentFixture<InfoTeamMatchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InfoTeamMatchComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(InfoTeamMatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
