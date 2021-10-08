import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PlayerContentComponent} from './player-content.component';

describe('PlayerContentComponent', () => {
    let component: PlayerContentComponent;
    let fixture: ComponentFixture<PlayerContentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlayerContentComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PlayerContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
