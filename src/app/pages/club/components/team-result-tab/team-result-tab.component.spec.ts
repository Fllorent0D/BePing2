import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamResultTabComponent} from './team-result-tab.component';

describe('TeamResultTabComponent', () => {
    let component: TeamResultTabComponent;
    let fixture: ComponentFixture<TeamResultTabComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamResultTabComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TeamResultTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
