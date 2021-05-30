import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext} from '@ngxs/store';

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

@State<EntityStateModel<DivisionEntry>>({
    name: 'divisions',
    defaults: defaultEntityState()
})
@Injectable()
export class DivisionsState extends EntityState<DivisionEntry> implements NgxsOnInit {

    constructor(private readonly divisionsService: DivisionsService) {
        super(DivisionsState, 'DivisionId', IdStrategy.EntityIdGenerator);
    }

    ngxsOnInit(ctx?: StateContext<EntityStateModel<DivisionEntry>>): void {
        const state = ctx.getState();
        const timeThreshold = sub(Date.now(), {weeks: 1});

        if (!state.ids.length || state.lastUpdated < timeThreshold.getTime()) {
            ctx.dispatch(new GetDivisions());
        }
    }

    @Action([GetDivisions, CurrentSeasonChanged, UpdateCurrentLangSuccess])
    getDivisions(ctx: StateContext<EntityStateModel<DivisionEntry>>) {
        ctx.dispatch(new SetLoading(DivisionsState, true));

        return this.divisionsService.findAllDivisions().pipe(
            map((divisions: DivisionEntry[]) => ctx.dispatch(new CreateOrReplace(DivisionsState, divisions))),
            catchError((err: Error) => of(ctx.dispatch(new SetError(DivisionsState, err)))),
            finalize(() => ctx.dispatch(new SetLoading(DivisionsState, false)))
        );
    }

}
