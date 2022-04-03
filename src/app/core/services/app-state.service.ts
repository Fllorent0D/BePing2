import {Injectable} from '@angular/core';
import {App} from '@capacitor/app';
import {Store} from '@ngxs/store';
import {UpdateMemberEntries} from '../store/user/user.actions';
import {UserState, UserStateModel} from '../store/user/user.state';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {

    constructor(
        private readonly store: Store
    ) {
    }

    init() {
        this.listenAppState();
    }

    listenAppState() {
        App.addListener('appStateChange', ({isActive}) => {
            console.log('App state changed. Is active?', isActive);
            if (isActive) {
                const state: UserStateModel = this.store.selectSnapshot(UserState);
                this.store.dispatch(new UpdateMemberEntries(state.memberUniqueIndex, false));
            }
        });
    }

}
