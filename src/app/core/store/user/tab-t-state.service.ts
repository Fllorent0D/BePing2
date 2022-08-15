import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {map, tap} from 'rxjs/operators';
import {Login, Logout} from './aftt.actions';
import {HealthService} from '../../api/services/health.service';
import {TestOutput} from '../../api/models/test-output';
import {AnalyticsService} from '../../services/firebase/analytics.service';

export interface TabTStateModel {
    account: string | null;
    password: string | null;
}

const defaultState: TabTStateModel = {
    account: null,
    password: null
};


@State<TabTStateModel>({
    name: 'tabt',
    defaults: defaultState
})
@Injectable()
export class TabTState {

    constructor(
        private readonly testService: HealthService,
    ) {
    }

    @Selector([TabTState])
    static isLoggedIn(state: TabTStateModel): boolean {
        return !!state.account;
    }

    @Action(Login)
    login({dispatch, patchState}: StateContext<TabTStateModel>, action: Login) {
        return this.testService.testRequest({
            'X-Tabt-Account': action.account,
            'X-Tabt-Password': action.password
        }).pipe(
            map((response: TestOutput) => {
                if (!response.IsValidAccount) {
                    throw new Error('Invalid login');
                }
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
        return patchState({
            account: null,
            password: null
        });
    }

}
