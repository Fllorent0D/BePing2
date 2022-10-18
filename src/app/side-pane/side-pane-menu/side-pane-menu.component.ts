import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';
import {IonMenu} from '@ionic/angular';

@Component({
    selector: 'beping-side-pane-menu',
    templateUrl: './side-pane-menu.component.html',
    styleUrls: ['./side-pane-menu.component.scss'],

})
export class SidePaneMenuComponent implements OnInit {

    @ViewChild('menu') private readonly menu: IonMenu;

    constructor(
        private readonly router: Router
    ) {
    }

    ngOnInit(): void {
        this.router.events.pipe(
            filter((e: RouterEvent) => e instanceof NavigationEnd),
        ).subscribe(() => {
            this.menu.close(true);
        });
    }

}
