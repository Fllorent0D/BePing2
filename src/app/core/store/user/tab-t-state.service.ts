import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {MemberEntry} from '../../api/models/member-entry';
import {ClubEntry} from '../../api/models/club-entry';
import {UpdateMemberEntries, HasSeenOnBoarding, UpdateMemberEntriesSuccess, SetUser, UpdateLatestMatchesSuccess} from './user.actions';
import {PlayerCategoryService} from '../../services/tabt/player-category.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {sub} from 'date-fns';
import {PLAYER_CATEGORY} from '../../models/user';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {Login, LoginFailure, LoginSuccess, Logout} from './aftt.actions';
import {HealthService} from '../../api/services/health.service';
import {iif} from 'rxjs';
import {TestOutput} from '../../api/models/test-output';
import {ToastController} from '@ionic/angular';
import {SeasonEntry} from '../../api/models/season-entry';
import {SeasonStateModel} from '../season';
import {AnalyticsService} from '../../services/firebase/analytics.service';

export interface TabTStateModel {
    account: string | null;
    password: string | null;
}

const defaultState: TabTStateModel = {
    account: null,
    password: null
};


@Injectable()
@State<TabTStateModel>({
    name: 'tabt',
    defaults: defaultState
})
export class TabTState {

    @Selector([TabTState])
    static isLoggedIn(state: TabTStateModel): boolean {
        return !!state.account;
    }

    constructor(
        private readonly testService: HealthService,
        private readonly analyticsService: AnalyticsService
    ) {
    }


    @Action(Login)
    login({dispatch, patchState}: StateContext<TabTStateModel>, action: Login) {
        return this.testService.testRequest({
            'X-Tabt-Account': action.account,
            'X-Tabt-Password': action.password
        }).pipe(
            map((response: TestOutput) => {
                if (!response.IsValidAccount) {
                    this.analyticsService.logEvent('login_failure', { account: action.account});
                    throw new Error('Invalid login');
                }
                this.analyticsService.logEvent('login_success', { account: action.account});
                return response;
            }),
            tap((response: TestOutput) => {
                patchState({
                    account: action.account,
                    password: action.password
                });
            })
        );
    }


    @Action(Logout)
    async logout({patchState}: StateContext<TabTStateModel>) {
        this.analyticsService.logEvent('logout');
        return patchState({
            account: null,
            password: null
        });
    }

}
