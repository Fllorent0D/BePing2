import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

import {ChooseClubPage} from './choose-club/choose-club.page';
import {ChoosePlayerPage} from './choose-player/choose-player.page';
import {ReactiveFormsModule} from '@angular/forms';
import {ModalBaseComponent} from './modal-base/modal-base.component';


@NgModule({
    declarations: [
        ChooseClubPage,
        ChoosePlayerPage,
        ModalBaseComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule
    ]
})
export class ModalsModule {
}
