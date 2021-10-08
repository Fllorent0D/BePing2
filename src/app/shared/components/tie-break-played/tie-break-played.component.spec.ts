import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TieBreakPlayedComponent} from './tie-break-played.component';

describe('TieBreakPlayedComponent', () => {
    let component: TieBreakPlayedComponent;
    let fixture: ComponentFixture<TieBreakPlayedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TieBreakPlayedComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(TieBreakPlayedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
