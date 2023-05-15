import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';
import {IonMenu, IonRouterOutlet} from '@ionic/angular';
import {ModalBaseComponent} from '../../pages/modals/modal-base/modal-base.component';
import {SettingsPage} from '../../pages/settings/containers/settings-page/settings.page';
import {AnalyticsService} from '../../core/services/firebase/analytics.service';
import {DialogService} from '../../core/services/dialog-service.service';

@Component({
    selector: 'beping-side-pane-menu',
    templateUrl: './side-pane-menu.component.html',
    styleUrls: ['./side-pane-menu.component.scss'],

})
export class SidePaneMenuComponent implements OnInit {

    @ViewChild('menu') private readonly menu: IonMenu;

    constructor(
        private readonly router: Router,
        private readonly ionRouter: IonRouterOutlet,
        private readonly analyticsService: AnalyticsService,
        private readonly dialogService: DialogService
    ) {
    }

    ngOnInit(): void {
        this.router.events.pipe(
            filter((e: RouterEvent) => e instanceof NavigationEnd),
        ).subscribe(() => {
            this.menu.close(true);
        });
    }

    openSettings(){
        this.analyticsService.logEvent('open_settings');

        this.dialogService.showModal({
            component: ModalBaseComponent,
            componentProps: {
                rootPage: SettingsPage
            },
            presentingElement: this.ionRouter.nativeEl
        });
    }

}
