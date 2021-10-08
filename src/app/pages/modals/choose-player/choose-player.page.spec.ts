import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ChoosePlayerPage} from './choose-player.page';

describe('ChoosePlayerPage', () => {
    let component: ChoosePlayerPage;
    let fixture: ComponentFixture<ChoosePlayerPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChoosePlayerPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ChoosePlayerPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
