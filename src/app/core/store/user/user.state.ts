import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {MemberEntry} from '../../api/models/member-entry';
import {ClubEntry} from '../../api/models/club-entry';
import {UpdateMemberEntries, HasSeenOnBoarding, UpdateMemberEntriesSuccess, SetUser, UpdateLatestMatchesSuccess} from './user.actions';
import {PlayerCategoryService} from '../../services/tabt/player-category.service';
import {map, switchMap} from 'rxjs/operators';
import {sub} from 'date-fns';
import {PLAYER_CATEGORY} from '../../models/user';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';

export interface UserStateModel {
    memberEntries?: {
        [key: string]: MemberEntry
    };
    latestMatches?: {
        [key: string]: TeamMatchesEntry[]
    };
    memberUniqueIndex?: number;
    club?: ClubEntry;
    hasSeeOnBoarding: boolean;
    lastUpdated: number;
}

const defaultState: UserStateModel = {
    memberEntries: null,
    memberUniqueIndex: null,
    latestMatches: null,
    club: null,
    hasSeeOnBoarding: false,
    lastUpdated: 0
};


@Injectable()
@State<UserStateModel>({
    name: 'user',
    defaults: defaultState
})
export class UserState implements NgxsOnInit {

    @Selector([UserState])
    static shouldSeeOnboarding(state: UserStateModel): boolean {
        return !state.hasSeeOnBoarding;
    }

    @Selector([UserState])
    static availablePlayerCategories(state: UserStateModel): PLAYER_CATEGORY[] {
        const keys = Object.keys(state.memberEntries) as PLAYER_CATEGORY[];
        return keys.filter((key) => state.memberEntries[key].ResultEntries);
    }

    static getMemberEntryForCategory(category: PLAYER_CATEGORY) {
        return createSelector([UserState], (userState: UserStateModel) => {
            return userState.memberEntries[category];
        });
    }

    static getLatestMatchesForCategory(category: PLAYER_CATEGORY) {
        return createSelector([UserState], (userState: UserStateModel) => {
            return userState.latestMatches[category];
        });
    }

    constructor(
        private readonly memberPlayerCategoryService: PlayerCategoryService
    ) {
    }

    ngxsOnInit({getState, dispatch}: StateContext<UserStateModel>): void {
        const state = getState();
        const timeThreshold = sub(Date.now(), {minutes: 10});

        if (state.memberUniqueIndex && state.lastUpdated < timeThreshold.getTime()) {
            dispatch(new UpdateMemberEntries(state.memberUniqueIndex));
        }
        dispatch(new UpdateMemberEntriesSuccess(state.memberEntries));
    }


    @Action(SetUser)
    setUser({patchState, dispatch}: StateContext<UserStateModel>, action: SetUser) {
        patchState({
            club: action.club,
            memberUniqueIndex: action.memberUniqueIndex
        });
        return dispatch(new UpdateMemberEntries(action.memberUniqueIndex));
    }


    @Action([UpdateMemberEntries])
    updateMemberEntries({dispatch}: StateContext<UserStateModel>, action: UpdateMemberEntries) {
        return this.memberPlayerCategoryService.getMemberPlayerCategories(action.memberUniqueIndex).pipe(
            switchMap((memberEntries) => dispatch(new UpdateMemberEntriesSuccess(memberEntries)))
        );
    }

    @Action([UpdateMemberEntriesSuccess])
    updateLatestMatches({dispatch}: StateContext<UserStateModel>, action: UpdateMemberEntriesSuccess) {
        return this.memberPlayerCategoryService.getMemberLatestMatches(action.memberEntries).pipe(
            switchMap((matches) => dispatch(new UpdateLatestMatchesSuccess(matches)))
        );
    }

    @Action(UpdateMemberEntriesSuccess)
    updateMemberEntriesSuccess({patchState}: StateContext<UserStateModel>, action: UpdateMemberEntriesSuccess) {
        return patchState({
            memberEntries: action.memberEntries,
            lastUpdated: Date.now()
        });
    }

    @Action(UpdateLatestMatchesSuccess)
    updateLatestMatchesSuccess({patchState}: StateContext<UserStateModel>, action: UpdateLatestMatchesSuccess) {
        return patchState({
            latestMatches: action.latestMatches
        });
    }


    @Action(HasSeenOnBoarding)
    hasSeenOnboarding({patchState}: StateContext<UserStateModel>) {
        return patchState({
            hasSeeOnBoarding: true
        });
    }

}
