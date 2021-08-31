import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {SeasonEntry} from '../../api/models/season-entry';
import {catchError, filter, finalize, switchMap, take} from 'rxjs/operators';
import {of} from 'rxjs';
import {CurrentSeasonChanged, GetCurrentSeason, GetCurrentSeasonFailure, SetSeasonLoading} from './season.actions';
import {SeasonsService} from '../../api/services/seasons.service';
import {ToastController} from '@ionic/angular';
import {AnalyticsService} from '../../services/firebase/analytics.service';
import {StorageService} from '../../services/store/storage.service';

export interface SeasonStateModel {
    currentSeason: SeasonEntry | null;
    loading: boolean;
    error: Error | null;
}

const defaultState: SeasonStateModel = {
    currentSeason: null,
    loading: false,
    error: null
};


@Injectable()
@State<SeasonStateModel>({
    name: 'season',
    defaults: defaultState
})
export class SeasonState implements NgxsOnInit {

    @Selector([SeasonState])
    static loading(state: SeasonStateModel): boolean {
        return state.loading;
    }

    @Selector([SeasonState])
    static getCurrentSeason(state: SeasonStateModel): SeasonEntry | null {
        return state.currentSeason;
    }

    @Selector([SeasonState])
    static error(state: SeasonStateModel): Error | null {
        return state.error;
    }

    constructor(
        private readonly seasonsService: SeasonsService,
        private readonly toastService: ToastController,
        private readonly analyticsService: AnalyticsService,
        private readonly storage: StorageService
    ) {
    }

    ngxsOnInit(ctx?: StateContext<any>): any {
        console.log('ON INIT:::');
        ctx.dispatch(new GetCurrentSeason());

    }

    @Action(GetCurrentSeason)
    getCurrentSeason({getState, dispatch, patchState}: StateContext<SeasonStateModel>) {
        const state = getState();
        return dispatch(new SetSeasonLoading(true)).pipe(
            switchMap(() => this.seasonsService.findCurrentSeason()),
            switchMap((seasonEntry: SeasonEntry) => {

                if (seasonEntry.Name !== state.currentSeason?.Name) {
                    this.analyticsService.logEvent('season_changed', {newSeason: seasonEntry.Name});
                    return dispatch(new CurrentSeasonChanged(seasonEntry));
                }
                return of();
            }),
            catchError((err: Error) => of(dispatch(new GetCurrentSeasonFailure(err)))),
            finalize(() => dispatch(new SetSeasonLoading(false)))
        );
    }

    @Action(CurrentSeasonChanged)
    async setCurrentSeason(ctx: StateContext<SeasonStateModel>, action: CurrentSeasonChanged) {
        const toast = await this.toastService.create({
            message: 'Season changed. Loading new season...',
            position: 'top',
            duration: 3000
        });
        toast.present();
        return ctx.patchState({currentSeason: action.season});
    }

    @Action(SetSeasonLoading)
    setLoading(ctx: StateContext<SeasonStateModel>, action: SetSeasonLoading) {

        return ctx.patchState({loading: action.loading});
    }


}
