import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IonRouterOutlet, NavController} from '@ionic/angular';
import {Select, Store} from '@ngxs/store';
import {ClubsState, GetClubs} from '../../core/store/clubs';
import {combineLatest, Observable} from 'rxjs';
import {DivisionsState, GetDivisions} from '../../core/store/divisions';
import {GetCurrentSeason, SeasonState} from '../../core/store/season';
import {map} from 'rxjs/operators';
import {HasSeenOnBoarding} from '../../core/store/user/user.actions';
import {FormControl, Validators} from '@angular/forms';
import {AnalyticsService} from '../../core/services/firebase/analytics.service';
import {DialogService} from '../../core/services/dialog-service.service';
import {PrivacyComponent} from '../../pages/settings/containers/privacy/privacy.component';
import {ConditionsUsageComponent} from '../../pages/settings/containers/conditions-usage/conditions-usage.component';
import {Network} from '@capacitor/network';
import {SwiperComponent} from 'swiper/angular';
import {SwiperOptions} from 'swiper';
import {FavoritesState} from '../../core/store/favorites';

@Component({
    selector: 'beping-onboarding',
    templateUrl: './onboarding.page.html',
    styleUrls: ['./onboarding.page.scss']
})
export class OnboardingPage implements OnInit, OnDestroy {

    @ViewChild('swiper', {static: false}) swiperComponent: SwiperComponent;

    swiperConfig: SwiperOptions = {
        speed: 150,
        edgeSwipeDetection: false,
        scrollbar: {
            draggable: true,
            hide: true,
        },
    };

    clubsLoading$: Observable<boolean>;
    clubsError$: Observable<Error | null>;

    divisionsError$: Observable<Error | null>;
    divisionsLoading$: Observable<boolean>;

    seasonLoading$: Observable<boolean>;
    seasonError$: Observable<Error | null>;

    acceptTermControl: FormControl<boolean> = new FormControl<boolean>(false, [Validators.required]);

    isLoading$: Observable<boolean>;
    hasError$: Observable<boolean>;
    isOnline: boolean;

    isSynchronized$: Observable<boolean>;

    constructor(
        private readonly router: Router,
        private readonly store: Store,
        private readonly navCtrl: NavController,
        private readonly analyticsService: AnalyticsService,
        private readonly ionRouter: IonRouterOutlet,
        private readonly dialogService: DialogService
    ) {
    }

    ngOnInit() {
        this.clubsLoading$ = this.store.select(ClubsState.loading);
        this.clubsError$ = this.store.select(ClubsState.error);
        this.divisionsLoading$ = this.store.select(DivisionsState.loading);
        this.divisionsError$ = this.store.select(DivisionsState.error);
        this.seasonLoading$ = this.store.select(SeasonState.loading);
        this.seasonError$ = this.store.select(SeasonState.error);

        this.isLoading$ = combineLatest([
            this.clubsLoading$,
            this.divisionsLoading$,
            this.seasonLoading$
        ]).pipe(
            map(([clubLoading, divisionsLoading, seasonLoading]) => {
                return clubLoading && divisionsLoading && seasonLoading;
            })
        );
        this.hasError$ = combineLatest([
            this.clubsError$,
            this.divisionsError$,
            this.seasonError$
        ]).pipe(
            map(([clubError, divisionError, seasonError]) => {
                return !!clubError || !!divisionError || !!seasonError;
            })
        );

        this.isSynchronized$ = combineLatest([
            this.isLoading$, this.hasError$
        ]).pipe(
            map(([isLoading, hasError]) => isLoading && !hasError)
        );
        this.listenNetwork();

    }

    ngOnDestroy(): void {
        Network.removeAllListeners();
    }

    private async listenNetwork() {
        const status = await Network.getStatus();
        this.isOnline = status.connected;
        Network.addListener('networkStatusChange', networkStatus => this.isOnline = networkStatus.connected);
    }

    skip() {
        this.router.navigate(['onboarding', 'login'], {skipLocationChange: true});
    }

    async goToEnd() {
        const indexCnt = this.swiperComponent.swiperRef.slides.length;
        this.swiperComponent.swiperRef.slideTo(indexCnt);
    }

    next() {
        this.swiperComponent.swiperRef.slideNext();
    }

    start() {
        this.store.dispatch([
            new HasSeenOnBoarding()
        ]).subscribe(() => {
            this.navCtrl.setDirection('root', true, 'forward');
            this.router.navigate(['tabs']);
        });
    }

    retry() {
        this.store.dispatch([
            new GetDivisions(),
            new GetClubs(),
            new GetCurrentSeason()
        ]);

    }

    openPrivacy() {
        this.analyticsService.logEvent('open_privacy_onboarding');
        this.dialogService.showModal({
            component: PrivacyComponent,
            componentProps: {
                isModal: true
            },
            canDismiss: true,
            presentingElement: this.ionRouter.nativeEl
        });
    }

    openCGU() {
        this.analyticsService.logEvent('open_cgu_onboarding');
        this.dialogService.showModal({
            component: ConditionsUsageComponent,
            componentProps: {
                isModal: true
            },
            canDismiss: true,
            presentingElement: this.ionRouter.nativeEl
        });
    }
}
