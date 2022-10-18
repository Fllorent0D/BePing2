import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {OrientationType, ScreenOrientation, ScreenOrientationChange} from '@capawesome/capacitor-screen-orientation';
import {IonMenu} from '@ionic/angular';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

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
        private readonly changeDetectionRed: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        // @ts-ignore
        ScreenOrientation.getCurrentOrientation().then(orientation => this.changeOrientation(orientation.type));
        ScreenOrientation.addListener('screenOrientationChange', (change: ScreenOrientationChange) => {
            this.changeOrientation(change.type);
        });

        this.router.events.pipe(
            filter((e: RouterEvent) => e instanceof NavigationEnd),
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

}
