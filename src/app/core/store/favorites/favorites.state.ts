import {Action, createSelector, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
    ToggleClubFromFavorites,
    ToggleDivisionFromFavorites,
    ToggleMemberFromFavorites,
    ToggleTeamsFromFavorites
} from './favorites.actions';
import {HapticsService} from '../../services/haptics.service';
import {ImpactStyle} from '@capacitor/haptics';
import {AnalyticsService} from '../../services/firebase/analytics.service';

export interface FavoriteItem<T = string | number> {
    uniqueIndex: T;
    label: string;
    uri?: string[];
    note?: string;
}

export interface FavoritesStateModel {
    clubs: FavoriteItem<string>[];
    divisions: FavoriteItem<number>[];
    members: FavoriteItem<number>[];
    teams: FavoriteItem<string>[];
}

@State<FavoritesStateModel>({
    name: 'favorites',
    defaults: {
        clubs: [],
        divisions: [],
        members: [],
        teams: []
    }
})
@Injectable()
export class FavoritesState {
    constructor(
        private readonly haptics: HapticsService,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    static isClubInFavorite(clubUniqueIndex: string) {
        return createSelector([FavoritesState], (state: FavoritesStateModel): boolean => {
            return !!state.clubs.find((item) => clubUniqueIndex === item.uniqueIndex);
        });
    }

    static isTeamInFavorite(index: string) {
        return createSelector([FavoritesState], (state: FavoritesStateModel): boolean => {
            return !!state.teams.find((item) => index === item.uniqueIndex);
        });
    }

    static isDivisionInFavorite(divisionId: number) {
        return createSelector([FavoritesState], (state: FavoritesStateModel): boolean => {
            return !!state.divisions.find((item) => divisionId === item.uniqueIndex);
        });
    }

    static isPlayerInFavorite(memberIndex: number) {
        return createSelector([FavoritesState], (state: FavoritesStateModel): boolean => {
            return !!state.members.find((item) => memberIndex === item.uniqueIndex);
        });
    }

    @Selector([FavoritesState])
    static favoriteClubs(state: FavoritesStateModel) {
        return state.clubs;
    }

    @Selector([FavoritesState])
    static favoriteDivision(state: FavoritesStateModel) {
        return state.divisions;
    }

    @Selector([FavoritesState])
    static favoriteTeams(state: FavoritesStateModel) {
        return state.teams;
    }

    @Selector([FavoritesState])
    static favoriteMembers(state: FavoritesStateModel) {
        return state.members;
    }


    @Action([ToggleClubFromFavorites])
    toggleClubFromFavorites({getState, patchState}: StateContext<FavoritesStateModel>, {payload}: ToggleClubFromFavorites) {
        const clubUniqueIndex = payload.UniqueIndex;
        const state = getState();
        const alreadyInFavorites = !!state.clubs.find((item) => clubUniqueIndex === item.uniqueIndex);
        const newFavorites = alreadyInFavorites ?
            state.clubs.filter(item => item.uniqueIndex !== clubUniqueIndex) :
            [...state.clubs, {uniqueIndex: clubUniqueIndex, label: payload.UniqueIndex + ' - ' + payload.LongName}];
        this.analyticsService.logEvent(alreadyInFavorites ? 'remove_club_favorites' : 'add_club_favorites', {clubUniqueIndex});
        return patchState({
            clubs: newFavorites
        });
    }

    @Action([ToggleMemberFromFavorites])
    toggleMemberFromFavorites({getState, patchState}: StateContext<FavoritesStateModel>, {payload}: ToggleMemberFromFavorites) {
        const memberUniqueIndex = payload.UniqueIndex;
        const state = getState();
        const alreadyInFavorites = !!state.members.find((item) => memberUniqueIndex === item.uniqueIndex);

        const newFavorites = alreadyInFavorites ?
            state.members.filter(item => item.uniqueIndex !== memberUniqueIndex) :
            [...state.members, {uniqueIndex: memberUniqueIndex, label: `${payload.FirstName} ${payload.LastName}`, note: payload.Ranking}];
        this.analyticsService.logEvent(alreadyInFavorites ? 'remove_member_favorites' : 'add_member_favorites', {memberUniqueIndex});

        return patchState({
            members: newFavorites
        });
    }

    @Action([ToggleDivisionFromFavorites])
    toggleDivisionFromFavorites({getState, patchState}: StateContext<FavoritesStateModel>, {payload}: ToggleDivisionFromFavorites) {
        const index = payload.DivisionId;
        const state = getState();
        const alreadyInFavorites = !!state.divisions.find((item) => index === item.uniqueIndex);

        const newFavorites = alreadyInFavorites ?
            state.divisions.filter(item => item.uniqueIndex !== index) :
            [...state.divisions, {uniqueIndex: index, label: payload.DivisionName}];
        this.analyticsService.logEvent(alreadyInFavorites ? 'remove_division_favorites' : 'add_division_favorites', {divisionId: index});

        return patchState({
            divisions: newFavorites
        });
    }

    @Action([ToggleTeamsFromFavorites])
    toggleTeamFromFavorites({getState, patchState}: StateContext<FavoritesStateModel>, {payload}: ToggleTeamsFromFavorites) {
        const state = getState();
        const alreadyInFavorites = !!(state.teams ?? []).find((item) => payload.uniqueIndex === item.uniqueIndex);

        const newFavorites = alreadyInFavorites ?
            (state.teams ?? []).filter(item => item.uniqueIndex !== payload.uniqueIndex) :
            [...(state.teams ?? []), payload];
        this.analyticsService.logEvent(alreadyInFavorites ? 'remove_teams_favorites' : 'add_teams_favorites', {team: payload.uniqueIndex});

        return patchState({
            teams: newFavorites
        });
    }

    @Action([ToggleClubFromFavorites, ToggleDivisionFromFavorites, ToggleMemberFromFavorites])
    vibrateOnToggle() {
        this.haptics.hapticsImpact(ImpactStyle.Medium);
    }

}
