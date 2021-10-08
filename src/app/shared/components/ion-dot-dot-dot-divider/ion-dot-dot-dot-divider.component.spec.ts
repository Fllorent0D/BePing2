import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {IonDotDotDotDividerComponent} from './ion-dot-dot-dot-divider.component';

describe('IonDotDotDotDividerComponent', () => {
    let component: IonDotDotDotDividerComponent;
    let fixture: ComponentFixture<IonDotDotDotDividerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IonDotDotDotDividerComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(IonDotDotDotDividerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
