import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {isPlatform} from '@ionic/core';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TabletGuard implements CanActivate {
    constructor(
        private readonly router: Router
    ) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (isPlatform('tablet')) {
            // return this.router.navigate(['split-pane', 'homeTab', 'home']);
            setTimeout(() => {
                return this.router.navigateByUrl('/split-pane/homeTab/home', {replaceUrl: true});
            }, 10);
            return false;
        }
        return true;
    }
}
