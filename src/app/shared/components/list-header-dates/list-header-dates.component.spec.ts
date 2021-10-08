import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ListHeaderDatesComponent} from './list-header-dates.component';

describe('ListHeaderDatesComponent', () => {
    let component: ListHeaderDatesComponent;
    let fixture: ComponentFixture<ListHeaderDatesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListHeaderDatesComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ListHeaderDatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
