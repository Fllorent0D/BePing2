import {NgModule} from '@angular/core';

import {ChooseClubPage} from './choose-club/choose-club.page';
import {ChoosePlayerPage} from './choose-player/choose-player.page';
import {ModalBaseComponent} from './modal-base/modal-base.component';
import {AfttLoginPage} from './aftt-login/aftt-login-page.component';
import {SharedModule} from '../../shared/shared.module';
import {ChooseMainMemberClubComponent} from './choose-main-member-club/choose-main-member-club.component';


@NgModule({
    declarations: [
        ChooseClubPage,
        ChoosePlayerPage,
        ModalBaseComponent,
        AfttLoginPage,
        ChooseMainMemberClubComponent
    ],
    imports: [
        SharedModule
    ]
})
export class ModalsModule {
}
