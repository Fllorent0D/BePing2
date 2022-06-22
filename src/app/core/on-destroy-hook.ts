import {Directive, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

export class OnDestroyHook implements OnDestroy {
    protected ngUnsubscribe: Subject<void> = new Subject();

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
    }
}
