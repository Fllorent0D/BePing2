import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ClubPlayerListTabComponent} from './club-player-list-tab.component';

describe('ClubPlayerListTabComponent', () => {
    let component: ClubPlayerListTabComponent;
    let fixture: ComponentFixture<ClubPlayerListTabComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClubPlayerListTabComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ClubPlayerListTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
