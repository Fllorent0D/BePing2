import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {SeasonEntry} from '../../api/models/season-entry';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {GetCurrentSeason, GetCurrentSeasonFailure, CurrentSeasonChanged, SetSeasonLoading} from './season.actions';
import {SeasonsService} from '../../api/services/seasons.service';
import {SetLoading} from '@ngxs-labs/entity-state';
import {ToastController} from '@ionic/angular';

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
    static error(state: SeasonStateModel): Error | null {
        return state.error;
    }

    constructor(
        private readonly seasonsService: SeasonsService,
        private readonly toastService: ToastController
    ) {
    }

    ngxsOnInit(ctx?: StateContext<any>): any {
        ctx.dispatch(new GetCurrentSeason());
    }

    @Action(GetCurrentSeason)
    getCurrentSeason({getState, dispatch, patchState}: StateContext<SeasonStateModel>) {
        const state = getState();
        return dispatch(new SetSeasonLoading(true)).pipe(
            switchMap(() => this.seasonsService.findCurrentSeason()),
            switchMap((seasonEntry: SeasonEntry) => {

                if (seasonEntry.Name !== state.currentSeason?.Name) {
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
