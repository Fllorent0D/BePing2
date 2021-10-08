import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ClubPage} from './club.page';

describe('ClubPage', () => {
    let component: ClubPage;
    let fixture: ComponentFixture<ClubPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClubPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ClubPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
