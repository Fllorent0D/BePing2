import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ChooseMainMemberClubComponent} from './choose-main-member-club.component';

describe('ChooseMainMemberClubComponent', () => {
    let component: ChooseMainMemberClubComponent;
    let fixture: ComponentFixture<ChooseMainMemberClubComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChooseMainMemberClubComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ChooseMainMemberClubComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
