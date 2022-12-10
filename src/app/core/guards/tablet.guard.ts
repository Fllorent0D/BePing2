import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {isPlatform} from '@ionic/core';
import {Observable} from 'rxjs';
import {NavController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class TabletGuard implements CanActivate {
    constructor(
        private readonly navCtrl: NavController
    ) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (isPlatform('tablet')) {
            setTimeout(() => {
                return this.navCtrl.navigateRoot('/split-pane/homeTab/home', {replaceUrl: true});
            }, 10);
            return false;
        }
        return true;
    }
}
