import {Injectable} from '@angular/core';
import {Action, NgxsAfterBootstrap, Selector, State, StateContext} from '@ngxs/store';
import {SeasonEntry} from '../../api/models/season-entry';
import {catchError, finalize, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {CurrentSeasonChanged, GetCurrentSeason, GetCurrentSeasonFailure, LoadSpecificSeason, SetSeasonLoading} from './season.actions';
import {SeasonsService} from '../../api/services/seasons.service';
import {AnalyticsService} from '../../services/firebase/analytics.service';
import {UpdateRemoteSettingKey} from '../remote-settings';
import {sub} from 'date-fns';

export interface SeasonStateModel {
    currentSeason: SeasonEntry | null;
    loading: boolean;
    lastUpdated: number;
    error: Error | null;
}

const defaultState: SeasonStateModel = {
    currentSeason: null,
    lastUpdated: 0,
    loading: false,
    error: null
};


@State<SeasonStateModel>({
    name: 'season',
    defaults: defaultState
})
@Injectable()
export class SeasonState implements NgxsAfterBootstrap{

    constructor(
        private readonly seasonsService: SeasonsService,
        private readonly analyticsService: AnalyticsService
    ) {
    }

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

    ngxsAfterBootstrap(ctx?: StateContext<SeasonStateModel>): void {
        const state = ctx.getState();
        const timeThreshold = sub(Date.now(), {days: 2});

        if (!state.currentSeason || state.lastUpdated < timeThreshold.getTime() || state.error) {
            ctx.dispatch(new GetCurrentSeason());
        }
    }

    checkIsSeasonChanged({getState, dispatch}: StateContext<SeasonStateModel>, action: UpdateRemoteSettingKey) {
        if (action.key !== 'current_season') {
            return;
        }
        const state = getState();
        if (state.currentSeason?.Season !== action.value) {
            console.log('Season changed from remote config. Going to season ' + JSON.stringify(action.value));
            this.seasonsService.findAllSeason().subscribe((seasons: SeasonEntry[]) => {
                const newSeason = seasons.find((season) => season.Season === action.value);
                if (newSeason) {
                    this.analyticsService.logEvent('season_changed', {newSeason: newSeason.Name});
                    return dispatch(new CurrentSeasonChanged(newSeason));
                }
                return of(null);
            });
            // dispatch(new GetCurrentSeason());
        }
    }

    @Action(GetCurrentSeason)
    getCurrentSeason({getState, dispatch, patchState}: StateContext<SeasonStateModel>) {
        const state = getState();
        return dispatch(new SetSeasonLoading(true)).pipe(
            switchMap(() => this.seasonsService.findCurrentSeason()),
            switchMap((activeSeason: SeasonEntry) => {
                if (activeSeason.Name !== state.currentSeason?.Name) {
                    this.analyticsService.logEvent('season_changed', {newSeason: activeSeason.Name});
                    return dispatch(new CurrentSeasonChanged(activeSeason));
                }
                patchState({lastUpdated: Date.now()});
                return of([]);
            }),
            catchError((err: Error) => of(dispatch(new GetCurrentSeasonFailure(err)))),
            finalize(() => dispatch(new SetSeasonLoading(false)))
        );
    }

    @Action(LoadSpecificSeason)
    setSpecificSeason({dispatch}: StateContext<SeasonStateModel>, action: LoadSpecificSeason) {
        return dispatch(new SetSeasonLoading(true)).pipe(
            switchMap(() => this.seasonsService.findSeasonById({seasonId: action.seasonId})),
            switchMap((season: SeasonEntry) => {
                this.analyticsService.logEvent('season_changed', {newSeason: season.Name});
                return dispatch(new CurrentSeasonChanged(season));
            }),
            catchError((err: Error) => of(dispatch(new GetCurrentSeasonFailure(err)))),
            finalize(() => dispatch(new SetSeasonLoading(false)))
        );
    }

    @Action(CurrentSeasonChanged)
    async setCurrentSeason(ctx: StateContext<SeasonStateModel>, action: CurrentSeasonChanged) {
        return ctx.patchState({currentSeason: action.season, lastUpdated: Date.now(), error: null});
    }

    @Action(SetSeasonLoading)
    setLoading(ctx: StateContext<SeasonStateModel>, action: SetSeasonLoading) {
        return ctx.patchState({loading: action.loading});
    }

    @Action(GetCurrentSeasonFailure)
    setCurrentSeasonFailure(ctx: StateContext<SeasonStateModel>, action: GetCurrentSeasonFailure) {
        return ctx.patchState({error: action.error, lastUpdated: Date.now()});
    }


}
