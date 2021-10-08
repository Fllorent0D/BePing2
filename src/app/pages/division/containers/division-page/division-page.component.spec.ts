import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {DivisionPageComponent} from './division-page.component';

describe('DivisionPageComponent', () => {
    let component: DivisionPageComponent;
    let fixture: ComponentFixture<DivisionPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DivisionPageComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(DivisionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
