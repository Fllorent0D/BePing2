import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MemberLatestMatchesComponent} from './member-latest-matches.component';

describe('MemberLatestMatchesComponent', () => {
    let component: MemberLatestMatchesComponent;
    let fixture: ComponentFixture<MemberLatestMatchesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemberLatestMatchesComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberLatestMatchesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
