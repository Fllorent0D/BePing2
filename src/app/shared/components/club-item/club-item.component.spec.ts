import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ClubItemComponent} from './club-item.component';

describe('ClubItemComponent', () => {
    let component: ClubItemComponent;
    let fixture: ComponentFixture<ClubItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClubItemComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ClubItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
