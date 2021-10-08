import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {DivisionsPageComponent} from './divisions-page.component';

describe('DivisionsPageComponent', () => {
    let component: DivisionsPageComponent;
    let fixture: ComponentFixture<DivisionsPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DivisionsPageComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(DivisionsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
