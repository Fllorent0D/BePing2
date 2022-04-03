import {Injectable} from '@angular/core';
import {IsProService} from '../is-pro.service';
import {TabsNavigationService} from '../navigation/tabs-navigation.service';

@Injectable({
    providedIn: 'root'
})
export class Face2FaceService {

    constructor(
        private readonly isPro: IsProService,
        private readonly tabNavigator: TabsNavigationService
    ) {
    }

    async checkIsProAndGoToFace2Face(opponentUniqueIndex: number): Promise<void> {
        const isPro = await this.isPro.isPro$().toPromise();
        if (isPro) {
            await this.tabNavigator.navigateTo(['player', 'face2face', opponentUniqueIndex.toString(10)]);
        }
    }


}
