import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiModule} from './api/api.module';
import {environment} from '../../environments/environment';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {states} from './store';
import {NgxsAsyncStoragePluginModule} from '@ngxs-labs/async-storage-plugin';
import {NgxsStorageService} from './services/store/ngxs-storage.service';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {AFTT_CLUB_CATEGORIES, TabtDatabaseInterceptor, VTTL_CLUB_CATEGORIES} from './interceptors/tabt-database-interceptor.service';
import {TabtCredentialsInterceptor} from './interceptors/tabt-credentials-interceptor.service';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {TabtHttpErrorHandlerInterceptor} from './interceptors/tabt-http-error-handler-interceptor.service';
import {FavoriteItem} from './store/favorites';
import {DialogService} from './services/dialog-service.service';
import {ApiConfiguration} from './api/api-configuration';
import {ApiConfigurationService} from './services/api-configuration.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ApiModule.forRoot({
            rootUrl: environment.tabtUrl
        }),
        SuperTabsModule.forRoot(),
        NgxsAsyncStoragePluginModule.forRoot(NgxsStorageService, {
            migrations: [
                {
                    version: undefined,
                    migrate: (state) => {
                        if (!state) {
                            return;
                        }
                        if (state?.user?.weeklyElo) {
                            delete state.user.weeklyElo;
                        }
                        if (!state?.settings?.hasOwnProperty('displayELO') && state?.user?.club) {
                            state.settings.displayELO = VTTL_CLUB_CATEGORIES.includes(state.user.club.Category);
                        }
                        if (!state?.settings?.hasOwnProperty('displayNumericRanking') && state?.user?.club) {
                            state.settings.displayNumericRanking = AFTT_CLUB_CATEGORIES.includes(state.user.club.Category);
                        }
                        console.log('Running migration to version 1');
                        return {
                            ...state,
                            version: 1
                        };
                    }
                },
                {
                    version: 1,
                    migrate: (state) => {
                        if (!state) {
                            return;
                        }

                        console.log('Running migration to version 2');

                        if (state?.favorites?.clubs?.length) {
                            state.favorites.clubs = state?.favorites?.clubs.map(
                                (favClub: FavoriteItem<string>): FavoriteItem<string> => {
                                    return {
                                        ...favClub,
                                        uri: ['clubs', favClub.uniqueIndex]
                                    };
                                });
                        }

                        if (state?.favorites?.divisions?.length) {
                            state.favorites.divisions = state?.favorites?.divisions.map(
                                (favDivision: FavoriteItem<number>): FavoriteItem<number> => {
                                    return {
                                        ...favDivision,
                                        uri: ['divisions', favDivision.uniqueIndex.toString()]
                                    };
                                });
                        }
                        if (state?.favorites?.members?.length) {
                            state.favorites.members = state?.favorites?.members.map(
                                (favMember: FavoriteItem<number>): FavoriteItem<number> => {
                                    return {
                                        ...favMember,
                                        uri: ['player', favMember.uniqueIndex.toString()]
                                    };
                                });
                        }
                        if (!state?.favorites?.teams) {
                            state.favorites.teams = [];
                        }

                        return {
                            ...state,
                            version: 2
                        };
                    }
                }

            ]
        }),
        NgxsModule.forRoot(
            [], {
                developmentMode: !environment.production,
                selectorOptions: {
                    injectContainerState: false
                }
            }
        ),
        NgxsModule.forFeature(states),
        NgxsLoggerPluginModule.forRoot({
            disabled: environment.production
        }),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production
        }),
        ScrollingModule,
        TranslateModule.forRoot({
            defaultLanguage: 'fr',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        LeafletModule
    ],
    providers: [
        TranslateService,
        {
            provide: ApiConfiguration,
            useClass: ApiConfigurationService
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TabtDatabaseInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TabtCredentialsInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TabtHttpErrorHandlerInterceptor,
            multi: true
        },
        DialogService
    ]
})
export class CoreModule {
}
