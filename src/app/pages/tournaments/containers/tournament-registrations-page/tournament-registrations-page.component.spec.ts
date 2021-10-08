import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TournamentRegistrationsPageComponent} from './tournament-registrations-page.component';

describe('TournamentRegistrationsPageComponent', () => {
    let component: TournamentRegistrationsPageComponent;
    let fixture: ComponentFixture<TournamentRegistrationsPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TournamentRegistrationsPageComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TournamentRegistrationsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
