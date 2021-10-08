import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConditionsUsageComponent} from './conditions-usage.component';

describe('ConditionsUsageComponent', () => {
    let component: ConditionsUsageComponent;
    let fixture: ComponentFixture<ConditionsUsageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConditionsUsageComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConditionsUsageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
