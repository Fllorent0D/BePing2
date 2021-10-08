import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {MemberEntry} from '../../api/models/member-entry';
import {ClubEntry} from '../../api/models/club-entry';
import {
    ClubTransfer,
    HasSeenOnBoarding,
    SetLoading,
    SetUser,
    UpdateLatestMatchesSuccess,
    UpdateMainCategory,
    UpdateMemberEntries,
    UpdateMemberEntriesSuccess,
    UpdateWeeklyNumericRankingSuccess
} from './user.actions';
import {PlayerCategoryService} from '../../services/tabt/player-category.service';
import {catchError, finalize, switchMap, tap} from 'rxjs/operators';
import {sub} from 'date-fns';
import {PLAYER_CATEGORY} from '../../models/user';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {TabTState} from './tab-t-state.service';
import {combineLatest, of} from 'rxjs';
import {MembersService} from '../../api/services/members.service';
import {WeeklyElo} from '../../api/models/weekly-elo';
import {AnalyticsService} from '../../services/firebase/analytics.service';
import {WeeklyNumericRanking} from '../../api/models/weekly-numeric-ranking';

export type UserMemberEntries = { [key: string]: MemberEntry };

export interface UserStateModel {
    memberEntries?: UserMemberEntries;
    latestMatches?: {
        [key: string]: TeamMatchesEntry[]
    };
    memberUniqueIndex?: number;
    mainCategory?: PLAYER_CATEGORY;
    club?: ClubEntry;
    numericRankings?: WeeklyNumericRanking[];
    hasSeeOnBoarding: boolean;
    isLoading: boolean;
    lastUpdated: number;
}

const defaultState: UserStateModel = {
    memberEntries: null,
    memberUniqueIndex: null,
    mainCategory: null,
    latestMatches: null,
    club: null,
    numericRankings: null,
    hasSeeOnBoarding: false,
    lastUpdated: 0,
    isLoading: false
};


@Injectable()
@State<UserStateModel>({
    name: 'user',
    defaults: defaultState,
    children: [TabTState]
})
export class UserState implements NgxsOnInit {

    constructor(
        private readonly memberPlayerCategoryService: PlayerCategoryService,
        private readonly memberService: MembersService,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    @Selector([UserState])
    static shouldSeeOnboarding(state: UserStateModel): boolean {
        return !state.hasSeeOnBoarding;
    }

    @Selector([UserState])
    static isLoading(state: UserStateModel): boolean {
        return state.isLoading;
    }

    @Selector([UserState])
    static numericRankings(state: UserStateModel): WeeklyNumericRanking[] {
        return state.numericRankings;
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

    ngxsOnInit({getState, dispatch}: StateContext<UserStateModel>): void {
        const state = getState();
        const timeThreshold = sub(Date.now(), {minutes: 30});

        if (state.memberUniqueIndex) {
            this.analyticsService.setUser(state.memberUniqueIndex.toString(10));
        }
        if (state.club) {
            this.analyticsService.setUserProperty('club', state.club.UniqueIndex);
        }

        if (state.lastUpdated < timeThreshold.getTime() && state.memberUniqueIndex) {
            dispatch(new UpdateMemberEntries(state.memberUniqueIndex));
        } else {
            console.log('no refreshing:::', state.lastUpdated, '>', timeThreshold.getTime());
        }
    }


    @Action(SetUser)
    setUser({patchState, dispatch}: StateContext<UserStateModel>, action: SetUser) {
        this.analyticsService.setUser(action.memberUniqueIndex.toString(10));
        this.analyticsService.setUserProperty('club_id', action.club.UniqueIndex);
        this.analyticsService.logEvent('choose_main_player', {
            memberUniqueIndex: action.memberUniqueIndex,
            clubUniqueIndex: action.club.UniqueIndex
        });
        patchState({
            club: action.club,
            mainCategory: null,
            memberUniqueIndex: action.memberUniqueIndex
        });
        return dispatch(new UpdateMemberEntries(action.memberUniqueIndex));
    }

    @Action(ClubTransfer)
    setClub({patchState, dispatch}: StateContext<UserStateModel>, action: SetUser) {
        this.analyticsService.setUserProperty('club_id', action.club.UniqueIndex);
        return patchState({
            club: action.club
        });
    }


    @Action([UpdateMemberEntries])
    updateMemberEntries({dispatch, getState}: StateContext<UserStateModel>, action: UpdateMemberEntries) {
        return combineLatest([
            this.memberPlayerCategoryService.getMemberPlayerCategories(action.memberUniqueIndex),
            this.memberService.findMemberNumericRankingsHistory({uniqueIndex: action.memberUniqueIndex})
                .pipe(catchError(() => of([])))
        ]).pipe(
            tap(() => dispatch(new SetLoading(true))),
            switchMap(([memberEntries, numericRanking]) => {
                const state = getState();
                const actions: Array<any> = [
                    new UpdateMemberEntriesSuccess(memberEntries),
                    new UpdateWeeklyNumericRankingSuccess(numericRanking)
                ];
                const categories = Object.keys(memberEntries);
                if (state.club.UniqueIndex !== memberEntries?.[categories?.[0]]?.Club) {
                    actions.push(new ClubTransfer(memberEntries[categories[0]].Club));
                }
                return dispatch(actions);
            }),
            finalize(() => dispatch(new SetLoading(false)))
        );
    }

    @Action([UpdateMemberEntriesSuccess])
    updateLatestMatches({dispatch}: StateContext<UserStateModel>, action: UpdateMemberEntriesSuccess) {
        return this.memberPlayerCategoryService.getMemberLatestMatches(action.memberEntries).pipe(
            switchMap((matches) => dispatch(new UpdateLatestMatchesSuccess(matches))),
            catchError(() => dispatch(new SetLoading(false)))
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

    @Action(UpdateWeeklyNumericRankingSuccess)
    updateWeeklyNumericRankingSuccess({patchState, getState}: StateContext<UserStateModel>, action: UpdateWeeklyNumericRankingSuccess) {
        return patchState({
            numericRankings: action.numericRankings
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
        this.analyticsService.logEvent('onboarding_complete');

        return patchState({
            hasSeeOnBoarding: true
        });
    }

    @Action(SetLoading)
    setLoading({patchState}: StateContext<UserStateModel>, {loading}: SetLoading) {
        return patchState({
            isLoading: loading
        });
    }

    @Action(UpdateMainCategory)
    updateMainCategory({patchState}: StateContext<UserStateModel>, action: UpdateMainCategory) {
        this.analyticsService.logEvent('main_member_category_changed', {main_category: action.category});

        return patchState({
            mainCategory: action.category
        });
    }


}
