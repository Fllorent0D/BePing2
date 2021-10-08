import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ClubTeamListTabComponent} from './club-team-list-tab.component';

describe('ClubTeamListTabComponent', () => {
    let component: ClubTeamListTabComponent;
    let fixture: ComponentFixture<ClubTeamListTabComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClubTeamListTabComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ClubTeamListTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
