import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MatchesPage} from './matches.page';

describe('MatchesPage', () => {
    let component: MatchesPage;
    let fixture: ComponentFixture<MatchesPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MatchesPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MatchesPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
