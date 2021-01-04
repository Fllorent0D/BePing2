import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {OnboardingPageRoutingModule} from './onboarding-routing.module';

import {OnboardingPage} from './onboarding/onboarding.page';
import {LoginPage} from './login/login.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        OnboardingPageRoutingModule
    ],
    declarations: [OnboardingPage, LoginPage]
})
export class OnboardingPageModule {
}
