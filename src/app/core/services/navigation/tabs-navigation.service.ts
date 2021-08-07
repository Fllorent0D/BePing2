import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class TabsNavigationService {

    constructor(
        private readonly router: Router,
        private readonly navCtrl: NavController
    ) {
    }

    navigateTo(page: string | string [], extras?: NavigationExtras): Promise<boolean> {
        // Oh yea such nice workaround
        const url = this.router.url.split('/');
        const newUrl = url.slice(0, 3);

        if (typeof page === 'string') {
            newUrl.push(...page.split('/'));
        } else {
            newUrl.push(...page);
        }

        this.navCtrl.setDirection('forward', true, 'forward');
        return this.router.navigate([`${newUrl.join('/')}`], extras);
    }

}
