import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {OrientationType, ScreenOrientation, ScreenOrientationChange} from '@capawesome/capacitor-screen-orientation';
import {IonMenu, IonRouterOutlet, NavController} from '@ionic/angular';
import {NavigationEnd, Router, Event} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ModalBaseComponent} from '../../pages/modals/modal-base/modal-base.component';
import {SettingsPage} from '../../pages/settings/containers/settings-page/settings.page';
import {AnalyticsService} from '../../core/services/firebase/analytics.service';
import {DialogService} from '../../core/services/dialog-service.service';

@Component({
    selector: 'beping-side-pane-layout',
    templateUrl: './side-pane-layout.component.html',
    styleUrls: ['./side-pane-layout.component.scss']
})
export class SidePaneLayoutComponent implements OnInit {

    show = true;
    landscape: boolean;
    @ViewChild('ionMenu') private readonly menu: IonMenu;

    constructor(
        private readonly router: Router,
        private readonly changeDetectionRed: ChangeDetectorRef,
        private readonly ionRouterOutlet: IonRouterOutlet,
        private readonly navCtrl: NavController,
        private readonly analyticsService: AnalyticsService,
        private readonly dialogService: DialogService
    ) {
    }

    ngOnInit(): void {
        // @ts-ignore
        this.navCtrl.setTopOutlet(this.ionRouterOutlet);
        ScreenOrientation.getCurrentOrientation().then(orientation => this.changeOrientation(orientation.type));
        ScreenOrientation.addListener('screenOrientationChange', (change: ScreenOrientationChange) => {
            this.changeOrientation(change.type);
        });

        this.router.events.pipe(
            filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd),
        ).subscribe(() => this.menu.close(true));

    }

    changeOrientation(orientation: OrientationType) {
        this.landscape = [
            OrientationType.LANDSCAPE_PRIMARY,
            OrientationType.LANDSCAPE_SECONDARY,
            OrientationType.LANDSCAPE
        ].includes(orientation);
        this.changeDetectionRed.detectChanges();
    }

    openSettings(){
        this.analyticsService.logEvent('open_settings');

        this.dialogService.showModal({
            component: ModalBaseComponent,
            canDismiss: true,
            componentProps: {
                rootPage: SettingsPage
            },
            presentingElement: this.ionRouterOutlet.nativeEl
        });
    }
}
