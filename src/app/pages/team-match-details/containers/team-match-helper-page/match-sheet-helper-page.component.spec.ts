import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSheetHelperPage } from './match-sheet-helper-page.component';

describe('TeamMatchHelperPageComponent', () => {
  let component: MatchSheetHelperPage;
  let fixture: ComponentFixture<MatchSheetHelperPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchSheetHelperPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchSheetHelperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
