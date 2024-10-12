import {Injectable} from '@angular/core';
import {NavigationEnd, Router, Event, RouterEvent} from '@angular/router';
import {distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';

import {FirebaseAnalytics} from '@capacitor-firebase/analytics';
import {combineLatest, from, Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {InAppPurchasesState} from '../../store/in-app-purchases/in-app-purchases.state';
import {SettingsState} from '../../store/settings';
import {LANG} from '../../models/langs';
import {UserState} from '../../store/user/user.state';
import {ClubEntry} from '../../api/models/club-entry';
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
            filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd),
            switchMap((event: NavigationEnd) => this.setScreenName(event.url))
        ).subscribe();

        const isProEvent$ = this.store.select(InAppPurchasesState.isPro).pipe(
            distinctUntilChanged(),
            filter((isPro) => isPro !== null),
            switchMap((isPro: boolean) => this.setUserProperty('isPro', `${isPro}`))
        );

        const currentLangEvent$ = this.store.select(SettingsState.getCurrentLang).pipe(
            distinctUntilChanged(),
            switchMap((lang: LANG) => this.setUserProperty('lang', lang))
        );

        const playerUniqueIndexEvent$ = this.store.select(UserState.getPlayerUniqueIndex).pipe(
            distinctUntilChanged(),
            filter((uniqueIndex) => !!uniqueIndex),
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
            tap(() => this.remoteConfigService.refreshRemoteConfig())
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
