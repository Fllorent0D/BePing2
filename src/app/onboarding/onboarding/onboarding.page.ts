import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'beping-onboarding',
    templateUrl: './onboarding.page.html',
    styleUrls: ['./onboarding.page.scss']
})
export class OnboardingPage implements OnInit {
    slideOpts = {
        autoplay: false
    };

    constructor(
        private readonly router: Router
    ) {
    }

    ngOnInit() {
    }

    skip() {
        this.router.navigate(['onboarding', 'login'], {skipLocationChange: true});
    }

}
