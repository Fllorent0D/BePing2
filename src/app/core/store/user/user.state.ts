import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {MemberEntry} from '../../api/models/member-entry';
import {ClubEntry} from '../../api/models/club-entry';
import {
    ClubTransfer,
    HasSeenOnBoarding,
    SetLoading,
    SetUser,
    UpdateClubEntry,
    UpdateLatestMatchesSuccess,
    UpdateMainCategory,
    UpdateMemberEntries,
    UpdateMemberEntriesSuccess,
    UpdateWeeklyNumericRankingSuccess
} from './user.actions';
import {PlayerCategoryService} from '../../services/tabt/player-category.service';
import {catchError, finalize, map, switchMap, tap} from 'rxjs/operators';
import {sub} from 'date-fns';
import {PLAYER_CATEGORY} from '../../models/user';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {TabTState} from './tab-t-state.service';
import {MembersService} from '../../api/services/members.service';
import {AnalyticsService} from '../../services/firebase/analytics.service';
import {WeeklyNumericRanking} from '../../api/models/weekly-numeric-ranking';
import {ClubsService} from '../../api/services/clubs.service';
import {of} from 'rxjs';
import {DeepPartial} from 'chart.js/types/utils';
import {CurrentSeasonChanged} from '../season';
import {CrashlyticsService} from '../../services/crashlytics.service';

export interface UserMemberEntry extends MemberEntry {
    numericRankings?: WeeklyNumericRanking[];
}

export type UserMemberEntries = { [key in PLAYER_CATEGORY]?: UserMemberEntry };

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


@State<UserStateModel>({
    name: 'user',
    defaults: defaultState,
    children: [TabTState]
})
@Injectable()
export class UserState implements NgxsOnInit {

    constructor(
        private readonly memberPlayerCategoryService: PlayerCategoryService,
        private readonly memberService: MembersService,
        private readonly clubService: ClubsService,
        private readonly analyticsService: AnalyticsService,
        private readonly crashlytics: CrashlyticsService
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

    @Selector([UserState])
    static getMemberClub(state: UserStateModel): ClubEntry | void {
        return state.club;
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

        // App initialize and need to refresh
        if (state.lastUpdated < timeThreshold.getTime() && state.memberUniqueIndex) {
            dispatch(new UpdateMemberEntries(state.memberUniqueIndex, false));
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
        // Selecting a user in the settings
        return dispatch(new UpdateMemberEntries(action.memberUniqueIndex, true));
    }

    // Force update for a new season
    @Action(CurrentSeasonChanged)
    updateMemberForNewSeason({dispatch, getState}: StateContext<UserStateModel>) {
        const userState = getState();
        if (userState.memberUniqueIndex) {
            dispatch(new UpdateMemberEntries(userState.memberUniqueIndex, true));
        }
    }

    @Action(ClubTransfer)
    clubTransfer({patchState, dispatch}: StateContext<UserStateModel>, action: ClubTransfer) {
        this.analyticsService.setUserProperty('club_id', action.newClubIndex);
        return this.clubService.findClubById({clubIndex: action.newClubIndex}).pipe(
            map((club) => dispatch(new UpdateClubEntry(club)))
        );
    }

    @Action(UpdateClubEntry)
    updateClubEntry({patchState, dispatch}: StateContext<UserStateModel>, action: UpdateClubEntry) {
        return patchState({
            club: action.club
        });
    }


    @Action([UpdateMemberEntries])
    updateMemberEntries({dispatch, getState}: StateContext<UserStateModel>, action: UpdateMemberEntries) {
        return this.memberPlayerCategoryService.getMemberPlayerCategories(action.memberUniqueIndex).pipe(
            tap(() => dispatch(new SetLoading(true))),
            switchMap((memberEntries: UserMemberEntries) => {
                const state = getState();
                const forceUpdate = action.forceUpdate;
                const categories: PLAYER_CATEGORY[] = Object.keys(memberEntries) as PLAYER_CATEGORY[];
                const actions: Array<any> = [];

                const shouldUpdateMemberEntries = forceUpdate || categories.reduce((acc: boolean, category: PLAYER_CATEGORY) => {
                    const resultsStored = state.memberEntries[category].ResultEntries;
                    const resultsReceived = memberEntries[category].ResultEntries;
                    if (resultsStored.length > resultsReceived.length) {
                        return false;
                    }
                    return acc;
                }, true);

                if (shouldUpdateMemberEntries) {
                    actions.push(new UpdateMemberEntriesSuccess(memberEntries));
                } else {
                    console.error(`Avoided wrong member update for ${action.memberUniqueIndex}. Received too less matches in one of the playing category.`);
                    this.crashlytics.recordException({
                        message: `Avoided wrong member update for ${action.memberUniqueIndex}. Received too less matches in one of the playing category.`,
                        domain: 'user-state'
                    });
                }

                if (state.club.UniqueIndex !== memberEntries?.[categories?.[0]]?.Club) {
                    actions.push(new ClubTransfer(memberEntries[categories[0]].Club));
                }
                return dispatch(actions);
            }),
            finalize(() => dispatch(new SetLoading(false)))
        );
    }

    @Action([UpdateMemberEntriesSuccess])
    updateGraphs({patchState, getState}: StateContext<UserStateModel>, action: UpdateMemberEntriesSuccess) {
        return this.memberPlayerCategoryService.getMemberNumericRankings(action.memberEntries).pipe(
            map((rankingsPerCategory) => {
                const state: UserStateModel = getState();
                const patchStateObj: DeepPartial<UserMemberEntries> = {...state.memberEntries};
                for (const [key, rankings] of Object.entries(rankingsPerCategory)) {
                    patchStateObj[key] = {
                        ...state.memberEntries[key],
                        numericRankings: rankings
                    };
                }
                // @ts-ignore
                return patchState({memberEntries: patchStateObj});
            }),
            catchError(() => of(null))
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
