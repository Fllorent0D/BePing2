import {DatePipe} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';
import {Store} from '@ngxs/store';
import {SettingsState} from '../../core/store/settings';
import {LANG} from '../../core/models/langs';

@Pipe({
    name: 'localizedDate',
    pure: false
})
export class LocalDatePipe implements PipeTransform {

    constructor(
        private readonly store: Store
    ) {
    }

    transform(value: any, pattern: string = 'mediumDate'): any {
        const currentLang = this.store.selectSnapshot(SettingsState.getCurrentLang) ?? LANG.FR;
        let langCode: string;
        switch (currentLang) {
            case LANG.FR:
                langCode = 'fr-BE';
                break;
            case LANG.NL:
                langCode = 'nl-BE';
                break;
            default:
                langCode = 'en-US';
        }

        const datePipe: DatePipe = new DatePipe(langCode);
        return datePipe.transform(value, pattern);
    }

}
