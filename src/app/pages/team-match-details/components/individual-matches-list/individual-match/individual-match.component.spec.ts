import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {IndividualMatchComponent} from './individual-match.component';

describe('IndividualMatchComponent', () => {
    let component: IndividualMatchComponent;
    let fixture: ComponentFixture<IndividualMatchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IndividualMatchComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(IndividualMatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
