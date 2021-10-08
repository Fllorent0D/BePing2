import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamMatchPlayerItemComponent} from './team-match-player-item.component';

describe('TeamMatchPlayerItemComponent', () => {
    let component: TeamMatchPlayerItemComponent;
    let fixture: ComponentFixture<TeamMatchPlayerItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamMatchPlayerItemComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TeamMatchPlayerItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
