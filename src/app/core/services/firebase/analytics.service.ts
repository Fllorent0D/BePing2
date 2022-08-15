import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {combineLatestWith, distinctUntilChanged, filter, first, switchMap, take} from 'rxjs/operators';

import {FirebaseAnalytics} from '@capacitor-firebase/analytics';
import {Device} from '@capacitor/device';
import {BehaviorSubject, combineLatest, firstValueFrom, from, Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {InAppPurchasesState} from '../../store/in-app-purchases/in-app-purchases.state';
import {SettingsState} from '../../store/settings';
import {LANG} from '../../models/langs';
import {UserState, UserStateModel} from '../../store/user/user.state';
import {ClubEntry} from '../../api/models/club-entry';
import {UpdateRemoteSettingKey} from '../../store/remote-settings';
import {RemoteConfigService} from '../remote-config.service';
import {FirebaseCrashlytics} from '@capacitor-firebase/crashlytics';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    constructor(
        private readonly router: Router,
        private readonly store: Store,
        private readonly remoteConfigService: RemoteConfigService
    ) {
    }

    async init(): Promise<void> {

        const screenNameEvent$ = this.router.events.pipe(
            filter((e: RouterEvent) => e instanceof NavigationEnd),
            switchMap((event: RouterEvent) => this.setScreenName(event.url))
        );

        const isProEvent$ = this.store.select(InAppPurchasesState.isPro).pipe(
            distinctUntilChanged(),
            switchMap((isPro: boolean) => this.setUserProperty('isPro', `${isPro}`))
        );

        const currentLangEvent$ = this.store.select(SettingsState.getCurrentLang).pipe(
            distinctUntilChanged(),
            switchMap((lang: LANG) => this.setUserProperty('lang', lang))
        );

        const playerUniqueIndexEvent$ = this.store.select(UserState.getPlayerUniqueIndex).pipe(
            distinctUntilChanged(),
            switchMap((uniqueIndex: number) => this.setUser(uniqueIndex.toString(10)))
        );

        const clubUniqueIndexEvent$ = this.store.select(UserState.getMemberClub).pipe(
            distinctUntilChanged((a: ClubEntry | undefined, b: ClubEntry | undefined) => a?.UniqueIndex === b?.UniqueIndex),
            switchMap((clubEntry: ClubEntry) => this.setUserProperty('club', clubEntry?.UniqueIndex))
        );

        combineLatest([
            isProEvent$,
            currentLangEvent$,
            playerUniqueIndexEvent$,
            clubUniqueIndexEvent$
        ]).pipe(
            take(1),
            switchMap(() => this.remoteConfigService.refreshRemoteConfig())
        ).subscribe(() => {
            console.log('refreshed remote config');
        });

    }

    setUser(userId: string): Observable<void> {
        FirebaseCrashlytics.setUserId({userId});
        return from(FirebaseAnalytics.setUserId({userId}));
    }

    setUserProperty(key: string, value: string): Observable<void> {
        return from(FirebaseAnalytics.setUserProperty({key, value}));
    }

    logEvent(name: string, params?: object) {
        return from(FirebaseAnalytics.logEvent({
            name,
            params
        }));
    }

    setScreenName(screenName: string): Observable<void> {
        return from(FirebaseAnalytics.setCurrentScreen({
            screenName,
            screenClassOverride: screenName
        }));
    }

}
