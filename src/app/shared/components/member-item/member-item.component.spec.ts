import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MemberItemComponent} from './member-item.component';

describe('MemberItemComponent', () => {
    let component: MemberItemComponent;
    let fixture: ComponentFixture<MemberItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemberItemComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
