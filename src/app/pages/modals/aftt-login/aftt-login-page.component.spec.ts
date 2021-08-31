import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfttLoginPage } from './aftt-login-page.component';

describe('AfttLoginComponent', () => {
  let component: AfttLoginPage;
  let fixture: ComponentFixture<AfttLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfttLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfttLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
