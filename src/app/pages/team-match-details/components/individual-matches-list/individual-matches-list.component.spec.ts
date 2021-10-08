import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {IndividualMatchesListComponent} from './individual-matches-list.component';

describe('IndividualMatchesListComponent', () => {
    let component: IndividualMatchesListComponent;
    let fixture: ComponentFixture<IndividualMatchesListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IndividualMatchesListComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(IndividualMatchesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
