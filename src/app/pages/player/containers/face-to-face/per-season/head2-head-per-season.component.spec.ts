import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Head2HeadPerSeasonComponent} from './head2-head-per-season.component';

describe('PerSeasonComponent', () => {
  let component: Head2HeadPerSeasonComponent;
  let fixture: ComponentFixture<Head2HeadPerSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Head2HeadPerSeasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Head2HeadPerSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
