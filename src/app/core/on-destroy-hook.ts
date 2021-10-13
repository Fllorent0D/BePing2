import {Directive, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class OnDestroyHook implements OnDestroy {
    protected ngUnsubscribe: Subject<void> = new Subject();

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}
