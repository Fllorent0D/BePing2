import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext} from '@ngxs/store';

import {ClubEntry} from '../../api/models/club-entry';
import {GetClubs} from './clubs.actions';
import {ClubsService} from '../../api/services/clubs.service';
import {tap} from 'rxjs/operators';

export interface ClubsStateModel {
    clubs: ClubEntry[];
}

const defaultState: ClubsStateModel = {
    clubs: []
};

@State<ClubsStateModel>({
    name: 'clubState',
    defaults: defaultState
})
@Injectable()
export class ClubsState implements NgxsOnInit {

    constructor(private readonly clubsService: ClubsService) {
    }

    ngxsOnInit(ctx?: StateContext<ClubsStateModel>): void {
        ctx.dispatch(new GetClubs());
    }


    @Action(GetClubs)
    getClubs({getState, patchState}: StateContext<ClubsStateModel>) {
        const state = getState();
        if (state.clubs && state.clubs.length > 0) {
            return;
        }

        return this.clubsService.findAllClubs().pipe(
            tap((clubs: ClubEntry[]) => patchState({clubs}))
        );
    }

}
