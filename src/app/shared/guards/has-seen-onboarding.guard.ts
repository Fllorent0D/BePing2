import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserState} from '../../core/store/user/user.state';
import {NavController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class HasSeenOnboardingGuard  {

    constructor(
        private readonly store: Store,
        private readonly navCtrl: NavController
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const shouldSeeOnboarding = this.store.selectSnapshot(UserState.shouldSeeOnboarding);

        if (shouldSeeOnboarding) {
            return this.navCtrl.navigateRoot(['onboarding']);
        }

        return true;
    }

}
