import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {IonItemTeamMatchComponent} from './components/ion-item-team-match/ion-item-team-match.component';
import {RankingComponent} from './components/ranking/ranking.component';
import {IonicModule} from '@ionic/angular';
import {InfoTeamMatchComponent} from './components/info-team-match/info-team-match.component';
import {IonDotDotDotDividerComponent} from './components/ion-dot-dot-dot-divider/ion-dot-dot-dot-divider.component';


@NgModule({
    declarations: [IonItemTeamMatchComponent, RankingComponent, InfoTeamMatchComponent, IonDotDotDotDividerComponent],
    exports: [IonItemTeamMatchComponent, RankingComponent, InfoTeamMatchComponent],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class SharedModule {
}
