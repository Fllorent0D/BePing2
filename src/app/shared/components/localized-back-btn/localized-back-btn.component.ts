import {Component, OnInit} from '@angular/core';
import {concat, concatAll, Observable, of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {map, startWith} from 'rxjs/operators';

@UntilDestroy()
@Component({
    selector: 'beping-localized-back-btn',
    templateUrl: './localized-back-btn.component.html',
    styleUrls: ['./localized-back-btn.component.css']
})
export class LocalizedBackBtnComponent implements OnInit {
    backBtnText$: Observable<string>;

    constructor(
        private readonly translateService: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.backBtnText$ = concat([this.translateService.onLangChange, of(this.translateService.currentLang)]).pipe(
            untilDestroyed(this),
            map(() => {
                return this.translateService.instant('BACK');
            }),
        );
    }

}
