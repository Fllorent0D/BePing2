import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {DeepLinkBaseComponent} from './deep-link-base-component/deep-link-base.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [
        DeepLinkBaseComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DeepLinkBaseComponent,
                outlet: 'deeplink-modal',
                loadChildren: () => import('../pages.module').then(m => m.PagesModule)

            }
        ]),
        SharedModule
    ]
})
export class DeepLinkModule {
}
