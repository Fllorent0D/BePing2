import {Action, createSelector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {ToggleClubFromFavorites} from './favorites.actions';

export interface FavoritesStateModel {
    clubIndexes: string[];
    divisionsIds: string[];
    playerUniqueIndexes: string[];
}


@State<FavoritesStateModel>({
    name: 'favorites',
    defaults: {
        clubIndexes: [],
        divisionsIds: [],
        playerUniqueIndexes: []
    }
})
@Injectable()
export class FavoritesState {


    static isClubInFavorite(clubUniqueIndex: string) {
        return createSelector([FavoritesState], (state: FavoritesStateModel) => {
            return state.clubIndexes.includes(clubUniqueIndex);
        });
    }


    @Action([ToggleClubFromFavorites])
    toggleClubFromFavorites({getState, patchState}: StateContext<FavoritesStateModel>, action: ToggleClubFromFavorites) {
        const clubUniqueIndex = action.clubUniqueIndex;
        const state = getState();
        const newFavorites = state.clubIndexes.includes(clubUniqueIndex) ?
            state.clubIndexes.filter(id => id !== clubUniqueIndex) :
            [...state.clubIndexes, clubUniqueIndex];
        return patchState({
            clubIndexes: newFavorites
        });
    }

}
