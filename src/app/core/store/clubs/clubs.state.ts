import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, State, StateContext} from '@ngxs/store';

import {ClubEntry} from '../../api/models/club-entry';
import {GetClubs} from './clubs.actions';
import {ClubsService} from '../../api/services/clubs.service';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {
    CreateOrReplace,
    defaultEntityState,
    EntityState,
    EntityStateModel,
    IdStrategy,
    Reset,
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
@Injectable()
export class ClubsState extends EntityState<ClubEntry> implements NgxsOnInit {

    constructor(private readonly clubsService: ClubsService) {
        super(ClubsState, 'UniqueIndex', IdStrategy.EntityIdGenerator);
    }

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

    static getClubName(uniqueIndex: string) {
        return createSelector([ClubsState.entities], (clubs: ClubEntry[]) => {
            const club = clubs.find((clubEntry: ClubEntry) => clubEntry.UniqueIndex === uniqueIndex);
            return club.Name;
        });
    }

    ngxsOnInit(ctx?: StateContext<EntityStateModel<ClubEntry>>): void {
        const state = ctx.getState();
        const timeThreshold = sub(Date.now(), {weeks: 1});

        if (!state.ids.length || state.lastUpdated < timeThreshold.getTime() || state.error) {
            ctx.dispatch(new GetClubs());
        }
    }

    @Action([CurrentSeasonChanged])
    seasonChanged(ctx: StateContext<EntityStateModel<ClubEntry>>) {
        return ctx.dispatch(new Reset(ClubsState)).pipe(
            switchMap(() => ctx.dispatch(new GetClubs()))
        );
    }

    @Action([GetClubs, CurrentSeasonChanged])
    getClubs(ctx: StateContext<EntityStateModel<ClubEntry>>) {
        ctx.dispatch(new SetLoading(ClubsState, true));

        return this.clubsService.findAllClubs().pipe(
            map((clubs: ClubEntry[]) =>
                ctx.dispatch([
                    new CreateOrReplace(ClubsState, clubs),
                    new SetError(ClubsState, null)
                ])
            ),
            catchError((err: Error) => of(ctx.dispatch(new SetError(ClubsState, err)))),
            finalize(() => ctx.dispatch(new SetLoading(ClubsState, false)))
        );
    }

}
