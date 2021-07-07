import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {MemberEntry} from '../../api/models/member-entry';
import {ClubEntry} from '../../api/models/club-entry';
import {
    HasSeenOnBoarding,
    SetUser,
    UpdateLatestMatchesSuccess,
    UpdateMainCategory,
    UpdateMemberEntries,
    UpdateMemberEntriesSuccess
} from './user.actions';
import {PlayerCategoryService} from '../../services/tabt/player-category.service';
import {switchMap} from 'rxjs/operators';
import {sub} from 'date-fns';
import {PLAYER_CATEGORY} from '../../models/user';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {TabTState} from './tab-t-state.service';

export type UserMemberEntries = { [key: string]: MemberEntry };

export interface UserStateModel {
    memberEntries?: UserMemberEntries;
    latestMatches?: {
        [key: string]: TeamMatchesEntry[]
    };
    memberUniqueIndex?: number;
    mainCategory?: PLAYER_CATEGORY;
    club?: ClubEntry;
    hasSeeOnBoarding: boolean;
    lastUpdated: number;
}

const defaultState: UserStateModel = {
    memberEntries: null,
    memberUniqueIndex: null,
    mainCategory: null,
    latestMatches: null,
    club: null,
    hasSeeOnBoarding: false,
    lastUpdated: 0
};


@Injectable()
@State<UserStateModel>({
    name: 'user',
    defaults: defaultState,
    children: [TabTState]
})
export class UserState implements NgxsOnInit {

    @Selector([UserState])
    static shouldSeeOnboarding(state: UserStateModel): boolean {
        return !state.hasSeeOnBoarding;
    }

    @Selector([UserState])
    static availablePlayerCategories(state: UserStateModel): PLAYER_CATEGORY[] {
        return PlayerCategoryService.getPlayedCategories(state.memberEntries);
    }

    @Selector([UserState])
    static getPlayerName(state: UserStateModel): string {
        const keys = Object.keys(state.memberEntries)[0];
        const memberEntry = state.memberEntries[keys];

        return memberEntry.FirstName + ' ' + memberEntry.LastName;
    }

    @Selector([UserState])
    static getMainPlayerCategory(state: UserStateModel): PLAYER_CATEGORY {
        return state.mainCategory;
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

        // dispatch(new UpdateMemberEntriesSuccess(state.memberEntries));
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
    updateMemberEntriesSuccess({patchState, getState}: StateContext<UserStateModel>, action: UpdateMemberEntriesSuccess) {
        const state = getState();

        const category: PLAYER_CATEGORY = state.mainCategory ?? PlayerCategoryService.getMainCategory(action.memberEntries);

        return patchState({
            memberEntries: action.memberEntries,
            lastUpdated: Date.now(),
            mainCategory: category
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

    @Action(UpdateMainCategory)
    updateMainCategory({patchState}: StateContext<UserStateModel>, action: UpdateMainCategory) {
        return patchState({
            mainCategory: action.category
        });
    }


}
