import {Injectable} from '@angular/core';
import {App} from '@capacitor/app';
import {GetPreferredResult, TextZoom} from '@capacitor/text-zoom';
import {Store} from '@ngxs/store';
import {UpdateMemberEntries} from '../store/user/user.actions';
import {UserState, UserStateModel} from '../store/user/user.state';
import {CheckPermissions} from '../store/notification-topics/notifications.actions';

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
        this.checkZoomText();
    }

    listenAppState() {
        App.addListener('appStateChange', ({isActive}) => {
            if (isActive) {
                this.updateMemberEntries();
                this.checkZoomText();
            }
        });
    }

    async checkZoomText() {
        const {value}: GetPreferredResult = await TextZoom.getPreferred();
        await TextZoom.set({value});
    }

    updateMemberEntries() {
        const state: UserStateModel = this.store.selectSnapshot(UserState);
        if (state.memberUniqueIndex) {
            this.store.dispatch([
                new UpdateMemberEntries(state.memberUniqueIndex, false),
            ]);
        }
        this.store.dispatch(new CheckPermissions());
    }

}
