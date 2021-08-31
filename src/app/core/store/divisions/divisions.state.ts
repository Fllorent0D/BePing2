import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, State, StateContext} from '@ngxs/store';

import {catchError, finalize, map} from 'rxjs/operators';
import {
    CreateOrReplace,
    defaultEntityState,
    EntityState,
    EntityStateModel,
    IdStrategy,
    SetError,
    SetLoading
} from '@ngxs-labs/entity-state';
import {of} from 'rxjs';
import {DivisionEntry} from '../../api/models/division-entry';
import {DivisionsService} from '../../api/services/divisions.service';
import {GetDivisions} from './divisions.actions';
import {sub} from 'date-fns';
import {CurrentSeasonChanged} from '../season';
import {UpdateCurrentLangSuccess} from '../settings';
import {Level} from '../../models/level';

@State<EntityStateModel<DivisionEntry>>({
    name: 'divisions',
    defaults: defaultEntityState()
})
@Injectable()
export class DivisionsState extends EntityState<DivisionEntry> implements NgxsOnInit {

    static searchDivision(terms: string) {
        const termsLowerCased = terms.toLowerCase();
        return createSelector(
            [DivisionsState.entities],
            (divisions: DivisionEntry[]) => {
                return divisions
                    .filter((div) => `${div.DivisionName}`.toLowerCase().indexOf(termsLowerCased) > -1)
                    .sort((a, b) => b.DivisionCategory > a.DivisionCategory ? 1 : b.DivisionCategory > a.DivisionCategory ? -1 : 0);
            });
    }

    static getDivisionByUniqueIndex(uniqueIndex: number) {
        return createSelector([DivisionsState.entities], (divisions: DivisionEntry[]) => {
            return divisions.find((division) => division.DivisionId === uniqueIndex);
        });
    }

    static getDivisionByLevel(level: Level) {
        return createSelector([DivisionsState.entities], (divisions: DivisionEntry[]) => {
            return divisions
                .filter((division) => division.Level === level)
                .sort((a, b) => a.DivisionName?.localeCompare(b.DivisionName));
        });
    }

    constructor(private readonly divisionsService: DivisionsService) {
        super(DivisionsState, 'DivisionId', IdStrategy.EntityIdGenerator);
    }

    ngxsOnInit(ctx?: StateContext<EntityStateModel<DivisionEntry>>): void {
        const state = ctx.getState();
        const timeThreshold = sub(Date.now(), {weeks: 1});

        if (!state.ids.length || state.lastUpdated < timeThreshold.getTime() || state.error) {
            ctx.dispatch(new GetDivisions());
        }
    }

    @Action([GetDivisions, CurrentSeasonChanged, UpdateCurrentLangSuccess])
    getDivisions(ctx: StateContext<EntityStateModel<DivisionEntry>>) {
        ctx.dispatch(new SetLoading(DivisionsState, true));

        return this.divisionsService.findAllDivisions().pipe(
            map((divisions: DivisionEntry[]) =>
                ctx.dispatch([
                    new CreateOrReplace(DivisionsState, divisions),
                    new SetError(DivisionsState, null)
                ])
            ),
            catchError((err: Error) => of(ctx.dispatch(new SetError(DivisionsState, err)))),
            finalize(() => ctx.dispatch(new SetLoading(DivisionsState, false)))
        );
    }

}
