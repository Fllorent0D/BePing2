import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TabsNavigationService {

    constructor(
        private readonly router: Router
    ) {
    }

    navigateTo(page: string | string []): Promise<boolean> {
        // Oh yea such nice workaround
        const url = this.router.url.split('/');
        const newUrl = url.slice(0, 3);

        if (typeof page === 'string') {
            newUrl.push(page);
        } else {
            newUrl.push(...page);
        }

        return this.router.navigate([`${newUrl.join('/')}`]);
    }

}
