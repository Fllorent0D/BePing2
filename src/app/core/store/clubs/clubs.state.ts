import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, SelectorOptions, State, StateContext} from '@ngxs/store';

import {ClubEntry} from '../../api/models/club-entry';
import {GetClubs} from './clubs.actions';
import {ClubsService} from '../../api/services/clubs.service';
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
import {sub} from 'date-fns';
import {CurrentSeasonChanged} from '../season';


@State<EntityStateModel<ClubEntry>>({
    name: 'clubs',
    defaults: defaultEntityState()
})
@SelectorOptions({
    injectContainerState: false
})
@Injectable()
export class ClubsState extends EntityState<ClubEntry> implements NgxsOnInit {

    static searchClub(terms: string) {
        const termsLowerCased = terms.toLowerCase();
        return createSelector([ClubsState.entities], (clubs: ClubEntry[]) => {
            return clubs
                .filter((club) => `${club.LongName}${club.UniqueIndex}`.toLowerCase().indexOf(termsLowerCased) > -1)
                .sort((a, b) => b.Category - a.Category);
        });
    }

    static getClubByUniqueIndex(uniqueIndex: string) {
        return createSelector([ClubsState.entities], (clubs: ClubEntry[]) => {
            return clubs.find((club) => club.UniqueIndex === uniqueIndex);
        });
    }

    constructor(private readonly clubsService: ClubsService) {
        super(ClubsState, 'UniqueIndex', IdStrategy.EntityIdGenerator);
    }

    ngxsOnInit(ctx?: StateContext<EntityStateModel<ClubEntry>>): void {
        const state = ctx.getState();
        const timeThreshold = sub(Date.now(), {months: 1});

        if (!state.ids.length || state.lastUpdated < timeThreshold.getTime()) {
            ctx.dispatch(new GetClubs());
        }
    }

    @Action([GetClubs, CurrentSeasonChanged])
    getClubs(ctx: StateContext<EntityStateModel<ClubEntry>>) {
        ctx.dispatch(new SetLoading(ClubsState, true));

        return this.clubsService.findAllClubs().pipe(
            map((clubs: ClubEntry[]) => ctx.dispatch(new CreateOrReplace(ClubsState, clubs))),
            catchError((err: Error) => of(ctx.dispatch(new SetError(ClubsState, err)))),
            finalize(() => ctx.dispatch(new SetLoading(ClubsState, false)))
        );
    }

}
