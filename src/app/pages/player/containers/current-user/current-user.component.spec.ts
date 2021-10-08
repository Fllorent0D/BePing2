import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {CurrentUserComponent} from './current-user.component';

describe('CurrentUserComponent', () => {
    let component: CurrentUserComponent;
    let fixture: ComponentFixture<CurrentUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CurrentUserComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(CurrentUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
